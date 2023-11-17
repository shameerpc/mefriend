/* eslint-disable prettier/prettier */
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Length } from 'class-validator';
import { Status } from 'src/common/enum/status.enum';
import { UserRole } from 'src/common/enum/user-role.enum';
import { gender } from 'src/common/enum/gender.enum';
import { RolesEntity } from './Roles';
@Index('UQ_email', ['email'], { unique: true, where: 'deleted_at IS NULL' })
@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true, default: '+91' })
  country_code: string;

  @Column({ nullable: false, unique: true })
  @Length(9, 11, {
    message: 'Phone number must be between 9 and 11 characters',
  })
  phone_number: string;

  @Column({ nullable: true })
  password: string;

  // @Column({ nullable: true, default: gender.male })
  // gender: number;
  @Column({ default: UserRole.USER })
  user_role: number;

  @ManyToOne(() => RolesEntity, (role) => role.id)
  @JoinColumn({ name: 'user_role' })
  role: RolesEntity;

  @Column({ nullable: true })
  device_type: string;

  @Column({ nullable: true })
  device_token: string;

  @Column({ nullable: true })
  social_profile_pic_url: string;

  @Column({ default: false })
  is_social: boolean;

  @Column({ default: false })
  is_google_login: boolean;

  @Column({ nullable: true })
  google_token: string;

  @Column({ default: Status.Active })
  status: number;

  @Column({ default: false }) //false => not verified  true=> verified
  otp_verified: boolean;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  referal_code: string;

  @Column({ nullable: true, default: 0 })
  referal_id: number;

  @Column({ default: 0 }) //0 => not deleted  1=> deleted
  delete_status: number;

  @Column({ default: 0 })
  created_by: number;

  @Column({ default: 0 })
  merchant_id: number;

  @Column({ default: 0 })
  updated_by: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deleted_at: Date;
}
