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
import { UserEntity } from './User';
import { QuestionEntity } from './Questions';
import { BookingEntity } from './Booking';

@Entity({ name: 'booking_question_answers' })
export class BookingQuestionAnswerEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
