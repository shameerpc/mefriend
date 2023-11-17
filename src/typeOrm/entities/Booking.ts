/* eslint-disable prettier/prettier */
import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './User';
import { EventEntity } from './Event';
import { BookingAdditionalUserEntity } from './BookingAdditionalUsers';
import { BookingCouponEntity } from './BookingCoupon';
import { BookingEventTicketEntity } from './BookingTicketTypes';
import { LocationEntity } from './Location';
@Entity({ name: 'booking' })
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ nullable: true })
  coupon_code: string;

  @Column({ nullable: true })
  total_ticket_count: number;

  @Column('double precision')
  total_ticket_amount: number;

  @Column({ nullable: false })
  event_id: number;

  @ManyToOne(() => EventEntity, (events) => events.id)
  @JoinColumn({ name: 'event_id' })
  events: EventEntity;
  @ManyToOne(() => LocationEntity, (location) => location.id)
  @JoinColumn({ name: 'city_id' })
  location: LocationEntity;

  @Column({ nullable: true })
  merchant_id: number;

  @Column({ nullable: false, default: 1 }) // 1'active'; 2:cancel
  booking_status: number;

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
  sort_order: number;

  @Column({ nullable: true })
  qrcode_image: string;

  @Column({ nullable: false })
  created_by: number;
  @ManyToOne(() => UserEntity, (users) => users.id)
  @JoinColumn({ name: 'created_by' })
  users: UserEntity;

  @OneToMany(
    () => BookingAdditionalUserEntity,
    (bookingAdditionalUser) => bookingAdditionalUser.booking,
  )
  @JoinColumn({ name: 'booking_id' }) // Specify the foreign key column
  booking_additional_users: BookingAdditionalUserEntity[];

  @OneToMany(
    () => BookingCouponEntity,
    (bookingCouponEntity) => bookingCouponEntity.booking,
  )
  @JoinColumn({ name: 'booking_id' }) // Specify the foreign key column
  booking_coupon: BookingCouponEntity[];

  @OneToMany(
    () => BookingEventTicketEntity,
    (bookingEventTicketEntity) => bookingEventTicketEntity.booking,
  )
  @JoinColumn({ name: 'booking_id' }) // Specify the foreign key column
  booking_event_ticket_type: BookingEventTicketEntity[];

  @Column({ nullable: true })
  event_ticket_type_id: number;

  @Column({ nullable: true })
  booking_code: string;
}
