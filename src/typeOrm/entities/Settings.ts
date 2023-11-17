/* eslint-disable prettier/prettier */
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { UserEntity } from './User';
import { Length } from 'class-validator';
@Entity({ name: 'settings' })
export class SettingsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true, default: '+91' })
  country_code: string;

  @Column({ nullable: true, unique: true })
  @Length(9, 11, {
    message: 'Phone number must be between 9 and 11 characters',
  })
  phone_number: string;

  @Column({ nullable: true })
  facebook_link: string;

  @Column({ nullable: true })
  instagram_link: string;

  @Column({ nullable: true })
  twitter_link: string;

  @Column({ nullable: true })
  linkedin_link: string;

  @Column({ nullable: false, default: 1 }) //1.Active; 0:Inactive
  status: number;

  @Column({ default: 0 }) //0 => not deleted  1=> deleted
  delete_status: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deleted_at: Date;

  @Column({ nullable: true })
  created_by: number;
  @ManyToOne(() => UserEntity, (users) => users.id)
  @JoinColumn({ name: 'created_by' })
  users: UserEntity;

  @Column({ nullable: false, default: 1 }) //1.Active; 0:Inactive
  single_referral_point: number;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  description: string;
}
