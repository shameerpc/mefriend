import { Status } from 'src/common/enum/status.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuestionEntity } from './Questions';
import { BookingEntity } from './Booking';
import { EventEntity } from './Event';
import { SubEventEntity } from './SubEvent';

@Entity({ name: 'subevent_question_answers' })
export class SubEventQuestionAnswerEntity {
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
  sub_events: SubEventEntity;

  @Column({ nullable: false })
  booking_id: number;
  @ManyToOne(() => BookingEntity, (booking) => booking.id)
  @JoinColumn({ name: 'booking_id' })
  booking: BookingEntity;

  @Column({ nullable: false })
  question_id: number;
  @ManyToOne(() => QuestionEntity, (question) => question.id)
  @JoinColumn({ name: 'question_id' })
  question: QuestionEntity;

  @Column({ nullable: true })
  option: string;

  @Column({ nullable: true })
  text_answer: string;

  @Column({ nullable: false, default: Status.Active })
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
