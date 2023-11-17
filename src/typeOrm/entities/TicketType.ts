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
@Entity({ name: 'ticket_types' })
export class TicketTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;
  @Column({ nullable: true })
  ticket_count: number;

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

  @Column('double precision', { nullable: true })
  price: number;

  @Column({ nullable: true })
  description: string;
}
