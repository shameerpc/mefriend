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

@Entity({ name: 'question_options' })
export class QuestionOptionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  question_id: number;
  @ManyToOne(() => QuestionEntity, (question) => question.id)
  @JoinColumn({ name: 'question_id' })
  question: QuestionEntity;

  @Column({ nullable: false })
  option: string;

  @Column({ nullable: false })
  created_by: number;
  @ManyToOne(() => UserEntity, (users) => users.id)
  @JoinColumn({ name: 'created_by' })
  users: UserEntity;

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
