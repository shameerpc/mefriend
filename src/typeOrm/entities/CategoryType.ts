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
import { EventSeasonEntity } from './EventSeason';

@Entity({ name: 'awards' })
export class CategoryTypeEntity {
  //this entity is used to set category type
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  season_id: number; // Foreign key column for the relationship

  @ManyToOne(() => EventSeasonEntity, (season) => season.id)
  @JoinColumn({ name: 'season_id' })
  season: EventSeasonEntity; // Define the relationship property

  @Column({ nullable: false, default: 1 }) //1.Active; 0:Inactive
  status: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deleted_at: Date;
}
