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
import { FormEntity } from './Forms';

@Entity({ name: 'sub_events' })
export class SubEventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  event_id: number;

  @ManyToOne(() => EventEntity, (events) => events.id)
  @JoinColumn({ name: 'event_id' })
  events: EventEntity;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  form_id: number;

  @ManyToOne(() => FormEntity, (form) => form.id)
  @JoinColumn({ name: 'form_id' })
  form: FormEntity;

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
