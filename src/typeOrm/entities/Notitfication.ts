import { Status } from 'src/common/enum/status.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './User';

@Entity({ name: 'notification' })
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  user_id: number;
  @ManyToOne(() => UserEntity, (users) => users.id)
  @JoinColumn({ name: 'user_id' })
  users: UserEntity;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: false, default: 1 }) //1 => Website  2=> Admin
  type: number;

  @Column({ default: 0 }) //0 => not read  1=> read
  read_status: number;

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
