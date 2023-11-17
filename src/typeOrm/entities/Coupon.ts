/* eslint-disable prettier/prettier */
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Double,
} from 'typeorm';
import { UserEntity } from './User';
@Entity({ name: 'coupon' })
export class CouponEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  coupon_name: string;

  @Column({ nullable: false })
  coupon_code: string;

  @Column({ nullable: false })
  discount_type: number; //1-percentage 2- amount

  @Column('double precision')
  discount_value: number;

  @Column('double precision', { nullable: true })
  minimum_discount_value: number;

  @Column({ nullable: true, type: 'timestamp' })
  coupon_code_duration_from: Date;

  @Column({ nullable: true, type: 'timestamp' })
  coupon_code_duration_to: Date;

  @Column({ nullable: true })
  minimum_coupon_redeem_count: number; // null - no limit

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

  @Column({ nullable: false })
  created_by: number;
  @ManyToOne(() => UserEntity, (users) => users.id)
  @JoinColumn({ name: 'created_by' })
  users: UserEntity;
}
