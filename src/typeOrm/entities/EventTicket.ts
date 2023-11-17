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
import { EventEntity } from './Event';
import { TicketTypeEntity } from './TicketType';
import { CategoryEntity } from './Category';
@Entity({ name: 'event_tickets' })
export class EventTicketEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  event_id: number;

  @ManyToOne(() => EventEntity, (events) => events.id)
  @JoinColumn({ name: 'event_id' })
  events: EventEntity;

  @Column({ nullable: false })
  ticket_type_id: number;
  @Column({ nullable: true })
  ticket_count: number;

  @ManyToOne(() => TicketTypeEntity, (ticket_types) => ticket_types.id)
  @JoinColumn({ name: 'ticket_type_id' })
  ticket_types: TicketTypeEntity;
  // @ManyToOne(() => UserEntity, (organizers) => organizers.id)
  // @JoinColumn({ name: "organizer_id" })
  // organizers: UserEntity;
  @ManyToOne(() => CategoryEntity, (category) => category.id)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

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

  @Column({ nullable: false })
  created_by: number;
  @ManyToOne(() => UserEntity, (users) => users.id)
  @JoinColumn({ name: 'created_by' })
  users: UserEntity;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;
}
