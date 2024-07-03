import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entity/user.entity';
import { IsNull, Repository } from 'typeorm';
import { FeedbackEntity } from 'src/database/entity/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { AccessTokenPayload } from 'src/common/interface';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { FeedbackTypeEnum, VoteTypeEnum } from 'src/common/enum';
import { CreateFeedbackResponseDto } from './response-dto/feedback-response.dto';
import { VoteQueryDto } from './dto/vote-query.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FeedbackVotedEvent } from './event';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    payload: AccessTokenPayload,
    dto: CreateFeedbackDto,
  ): Promise<CreateFeedbackResponseDto> {
    const user = await this.userRepository.findOneBy({ id: payload.id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const feedback = new FeedbackEntity();
    feedback.user = user;
    feedback.feedbackType = dto.feedbackType;
    feedback.text = dto.text ?? null;

    if (dto.feedbackType === FeedbackTypeEnum.COMMENT) {
      if (!dto.parentCommentId) {
        throw new BadRequestException(
          'parentCommentId is required when feedbackType set to COMMENT',
        );
      }

      const parentComment = await this.feedbackRepository.findOne({
        where: {
          id: dto.parentCommentId,
          feedbackType: FeedbackTypeEnum.REVIEW,
        },
        relations: { user: true },
      });

      if (!parentComment) {
        throw new NotFoundException(
          'parentComment not found. Note that comments to comments are not allowed',
        );
      }

      feedback.parentComment = parentComment;
    }

    if (dto.doctorId) {
      if (dto.feedbackType === FeedbackTypeEnum.COMMENT) {
        throw new BadRequestException(
          'feedback with type comment must not have doctorId',
        );
      }

      const doctor = await this.doctorRepository.findOneBy({
        id: dto.doctorId,
      });

      if (!doctor) {
        throw new NotFoundException('doctor not found');
      }

      feedback.doctor = doctor;
    }

    const {
      identifiers: [{ id }],
    } = await this.feedbackRepository.insert(feedback);
    const feedbackDetails = await this.feedbackRepository.findOneBy({ id });

    return feedbackDetails!;
  }

  async getByDoctorId(id: number): Promise<FeedbackEntity[]> {
    return this.feedbackRepository.find({
      where: {
        doctorId: id,
        parentCommentId: IsNull(),
      },
      relations: {
        user: true,
        comments: { user: true },
      },
    });
  }

  // TODO: check if transaction needed
  async vote(id: number, query: VoteQueryDto): Promise<void> {
    const feedback = await this.feedbackRepository.findOneBy({ id });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    if (query.type === VoteTypeEnum.LIKE) {
      await this.feedbackRepository.increment({ id }, 'likeCount', 1);
    } else if (query.type === VoteTypeEnum.DISLIKE) {
      await this.feedbackRepository.increment({ id }, 'dislikeCount', 1);
    }

    // TODO: add listeners, event driven architecture (martin fowler report)
    this.eventEmitter.emit(
      FeedbackVotedEvent.EVENT_NAME,
      new FeedbackVotedEvent(feedback),
    );
  }
}
