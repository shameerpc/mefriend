/* eslint-disable prettier/prettier */
import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './User';
import { BookingEntity } from './Booking';
import { CouponEntity } from './Coupon';
@Entity({ name: 'booking_coupon' })
export class BookingCouponEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  booking_id: number;

  @ManyToOne(() => BookingEntity, (booking) => booking.id)
  @JoinColumn({ name: 'booking_id' })
  booking: BookingEntity;

  @Column({ nullable: false })
  coupon_id: number;

  @ManyToOne(() => CouponEntity, (coupon) => coupon.id)
  @JoinColumn({ name: 'coupon_id' })
  coupon: CouponEntity;

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
}
