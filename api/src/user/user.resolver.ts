import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/database/entity/comment.entity';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { PatientEntity } from 'src/database/entity/patient.entity';
import { ReviewEntity } from 'src/database/entity/review.entity';
import { UserNotificationEntity } from 'src/database/entity/user-notification.entity';
import { ReviewModel } from 'src/graphql/models/review.model';
import { ReviewService } from 'src/review/review.service';
import { UserService } from 'src/user/user.service';
import { In, Repository } from 'typeorm';
import { UserModel } from '../graphql/models/user.model';
import { GetUserInput } from './input/get-user.input';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserNotificationEntity)
    private readonly userNotificationRepository: Repository<UserNotificationEntity>,
    private readonly reviewService: ReviewService,
  ) {}

  // TODO: limits to nested data
  // TODO: use multiple queries?
  @Query(() => UserModel, { nullable: true })
  getUserById(@Args('getUser') input: GetUserInput) {
    return this.userService.getById(input.id);
  }

  @ResolveField()
  async doctors(@Parent() user: UserModel) {
    return this.doctorRepository.find({
      where: { userId: user.id },
      relations: {
        appointments: true,
        departments: true,
        availableSlots: true,
        reviews: true,
        user: true,
      },
    });
  }

  @ResolveField()
  async patients(@Parent() user: UserModel) {
    return this.patientRepository.find({
      where: { userId: user.id },
      relations: {
        appointments: true,
        user: true,
      },
    });
  }

  // TODO: refactor without using service since multiple db requests inside service method
  @ResolveField()
  async reviews(@Parent() user: UserModel) {
    if (!user.reviews) {
      return [];
    }

    const reviewsIds = user.reviews.map((review) => review.id);
    const reviews = await this.reviewRepository.find({
      where: { id: In(reviewsIds) },
      relations: { comments: true },
    });

    reviews.forEach((review) => {
      const commentTree: CommentEntity[] = [];
      const commentMap = new Map<number, CommentEntity>();

      review.comments?.forEach((comment) => {
        commentMap.set(comment.id, comment);
      });

      review.comments?.forEach((comment) => {
        if (comment.parentCommentId === null) {
          commentTree.push(comment);
          return;
        }

        const parentComment = commentMap.get(comment.parentCommentId)!;
        let lastParent = parentComment;

        while (this.reviewService.getDepth(lastParent, commentMap) >= 5) {
          if (!lastParent.parentCommentId) {
            break;
          }

          lastParent = commentMap.get(lastParent.parentCommentId)!;
        }

        if (parentComment.id != lastParent.id) {
          comment.parentCommentId = lastParent.id;
        }

        lastParent.childComments = lastParent.childComments || [];
        lastParent.childComments.push(comment);
      });

      review.comments = commentTree;
    });

    const reviewModelsPromises = reviews.map(async (review) => {
      const reviewWithComments = await this.reviewService.getById(review.id, 2);

      const reviewModel = new ReviewModel();
      reviewModel.id = review.id;
      reviewModel.text = review.text;
      reviewModel.rating = review.rating;
      reviewModel.comments = reviewWithComments.comments;

      return reviewModel;
    });
    const reviewModels = await Promise.all(reviewModelsPromises);

    return reviewModels;
  }

  @ResolveField()
  async comments(@Parent() user: UserModel) {
    return this.commentRepository.find({
      where: { userId: user.id },
      relations: {
        user: true,
        childComments: true,
        parentComment: true,
        review: true,
      },
    });
  }

  @ResolveField()
  async notifications(@Parent() user: UserModel) {
    return this.userNotificationRepository.find({
      where: { userId: user.id },
      relations: {
        user: true,
        review: true,
        appointment: true,
        comment: true,
      },
    });
  }
}
