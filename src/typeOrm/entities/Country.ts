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

@Entity({ name: 'countries' })
export class CountryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  country_code: string;
  @Column({ nullable: true })
  country_name: string;
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

  @Column({ nullable: false, default: 1 }) //1.Active; 0:Inactive
  status: number;
}
