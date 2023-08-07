import { UserRoleEnum } from 'src/common/enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password?: string;

  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.GUEST })
  role!: UserRoleEnum;

  @Column({ name: 'first_name' })
  firstName!: string;

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt?: Date;

  @Column({ name: 'reset_token', type: String, select: false, nullable: true })
  resetToken?: string | null;
}
