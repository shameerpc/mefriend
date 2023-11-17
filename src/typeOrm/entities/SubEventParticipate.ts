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
import { EventEntity } from './Event';
import { SubEventEntity } from './SubEvent';
import { BookingEntity } from './Booking';
import { UserEntity } from './User';

@Entity({ name: 'sub_events_participate' })
export class SubEventParticipateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  event_id: number;

  @ManyToOne(() => EventEntity, (events) => events.id)
  @JoinColumn({ name: 'event_id' })
  events: EventEntity;

  @Column({ nullable: false })
  sub_event_id: number;

  @ManyToOne(() => SubEventEntity, (sub_events) => sub_events.id)
  @JoinColumn({ name: 'sub_event_id' })
  subevents: SubEventEntity;

  @Column({ nullable: false })
  booking_id: number;

  @ManyToOne(() => BookingEntity, (booking) => booking.id)
  @JoinColumn({ name: 'booking_id' })
  booking: BookingEntity;

  @Column({ nullable: false })
  user_id: number;

  @ManyToOne(() => UserEntity, (users) => users.id)
  @JoinColumn({ name: 'user_id' })
  users: UserEntity;

  @Column({ nullable: false, default: 1 })
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
