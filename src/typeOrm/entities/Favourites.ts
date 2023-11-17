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
import { UserEntity } from './User';
import { EventEntity } from './Event';
@Entity({ name: 'favourites' })
export class FavouriteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  event_id: number;

  @ManyToOne(() => EventEntity, (events) => events.id)
  @JoinColumn({ name: 'event_id' })
  events: EventEntity;

  @Column({ nullable: false })
  user_id: number;

  @ManyToOne(() => UserEntity, (users) => users.id)
  @JoinColumn({ name: 'user_id' })
  users: UserEntity;

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
}
