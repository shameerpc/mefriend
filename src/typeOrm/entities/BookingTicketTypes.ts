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
import { EventTicketEntity } from './EventTicket';
import { EventEntity } from './Event';
import { TicketTypeEntity } from './TicketType';
@Entity({ name: 'booking_event_ticket_type' })
export class BookingEventTicketEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  booking_id: number;

  @ManyToOne(() => BookingEntity, (booking) => booking.id)
  @JoinColumn({ name: 'booking_id' })
  booking: BookingEntity;

  @Column({ nullable: false })
  event_ticket_type_id: number;

  @ManyToOne(() => EventTicketEntity, (eventticket) => eventticket.id)
  @JoinColumn({ name: 'event_ticket_type_id' })
  eventticket: EventTicketEntity;

  @Column({ nullable: false })
  event_id: number;

  @ManyToOne(() => EventEntity, (events) => events.id)
  @JoinColumn({ name: 'event_id' })
  events: EventEntity;

  @Column({ nullable: false })
  ticket_type_id: number;

  @ManyToOne(() => TicketTypeEntity, (ticket_types) => ticket_types.id)
  @JoinColumn({ name: 'ticket_type_id' })
  ticket_types: TicketTypeEntity;

  @Column({ nullable: false, default: 1 })
  status: number;

  @Column('double precision')
  price: number;

  @Column({ default: 0 }) //0 => not deleted  1=> deleted
  delete_status: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deleted_at: Date;
}
