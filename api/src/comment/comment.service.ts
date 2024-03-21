import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenPayload } from 'src/common/interface';
import { CommentEntity } from 'src/database/entity/comment.entity';
import { ReviewEntity } from 'src/database/entity/review.entity';
import { UserEntity } from 'src/database/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';

Injectable();
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async create(
    dto: CreateCommentDto,
    payload: AccessTokenPayload,
  ): Promise<CommentEntity> {
    const user = await this.userRepository.findOneBy({ id: payload.id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!dto.parentCommentId && !dto.reviewId) {
      throw new BadRequestException(
        'One of parentCommentId and reviewId parameters required',
      );
    }

    const comment = new CommentEntity();
    comment.user = user;

    if (dto.reviewId) {
      const review = await this.reviewRepository.findOneBy({
        id: dto.reviewId,
      });

      if (!review) {
        throw new NotFoundException('Review not found');
      }

      comment.review = review;
    }

    comment.text = dto.text;

    if (dto.parentCommentId) {
      const quoteComment = await this.commentRepository.findOne({
        where: { id: dto.parentCommentId },
        relations: { user: true },
      });

      if (!quoteComment) {
        throw new NotFoundException('Quote comment not found');
      }

      comment.text = `${quoteComment.user!.fullName}, ${dto.text}`;
    }

    const insertRes = await this.commentRepository.insert(comment);
    const commentId = insertRes.identifiers[0].id;
    const commentDetails = await this.commentRepository.findOneBy({
      id: commentId,
    });

    return commentDetails!;
  }
}
