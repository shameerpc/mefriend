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
import { QuestionTypeEntity } from './QuestionType';
import { QuestionOptionEntity } from './QuestionOptions';
import { FormEntity } from './Forms';

@Entity({ name: 'questions' })
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  form_id: number;
  @ManyToOne(() => FormEntity, (form) => form.id)
  @JoinColumn({ name: 'form_id' })
  form: FormEntity;

  @Column({ default: 1 })
  event_type: number;

  @Column({ nullable: true })
  event_type_id: number;

  @Column({ nullable: false })
  question_type: number;
  @ManyToOne(() => QuestionTypeEntity, (questiontype) => questiontype.id)
  @JoinColumn({ name: 'question_type' })
  questiontype: QuestionTypeEntity;

  @Column({ nullable: false })
  created_by: number;
  @ManyToOne(() => UserEntity, (users) => users.id)
  @JoinColumn({ name: 'created_by' })
  users: UserEntity;

  @Column({ nullable: true })
  merchant_id: number;

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

  @OneToMany(
    () => QuestionOptionEntity,
    (questionOptionEntity) => questionOptionEntity.question,
  )
  @JoinColumn({ name: 'question_id' }) // Specify the foreign key column
  questionoptions: QuestionOptionEntity[];
}
