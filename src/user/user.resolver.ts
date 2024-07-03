import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { PatientEntity } from 'src/database/entity/patient.entity';
import { UserNotificationEntity } from 'src/database/entity/user-notification.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
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
    @InjectRepository(UserNotificationEntity)
    private readonly userNotificationRepository: Repository<UserNotificationEntity>,
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

  @ResolveField()
  async notifications(@Parent() user: UserModel) {
    return this.userNotificationRepository.find({
      where: { userId: user.id },
      relations: {
        user: true,
        feedback: true,
        appointment: true,
      },
    });
  }
}
