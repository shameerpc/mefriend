/* eslint-disable prettier/prettier */
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserRole } from 'src/common/enum/user-role.enum';
import { SupportTicketsEntity } from './SupportTickets';
@Entity({ name: 'support_tickets_comments' })
export class TicketCommentsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => SupportTicketsEntity,
    (support_tickets) => support_tickets.id,
  )
  @JoinColumn({ name: 'ticket_id' })
  ticketid: SupportTicketsEntity;

  @Column({ nullable: true })
  ticket_id: number;

  @Column({ nullable: true })
  comment: string;

  @Column({ default: UserRole.SUPERADMIN })
  user_role: number;

  @Column({ default: 0 }) //0 => not read  1=> read
  read_status: number;

  @Column({ default: 0 }) //0 => not deleted  1=> deleted
  delete_status: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deleted_at: Date;
}
