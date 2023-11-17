/* eslint-disable prettier/prettier */
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Double,
} from 'typeorm';
import { UserEntity } from './User';
import { CategoryEntity } from './Category';
import { FormEntity } from './Forms';
import { LocationEntity } from './Location';
import { CountryEntity } from './Country';

@Entity({ name: 'events' })
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  event_code: string;

  @Column({ nullable: true })
  organizer_id: number;

  @ManyToOne(() => UserEntity, (organizers) => organizers.id)
  @JoinColumn({ name: 'organizer_id' })
  organizers: UserEntity;

  @Column({ nullable: true })
  category_id: number;

  @ManyToOne(() => CategoryEntity, (category) => category.id)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @Column({ nullable: true })
  form_id: number;

  @ManyToOne(() => FormEntity, (form) => form.id)
  @JoinColumn({ name: 'form_id' })
  form: FormEntity;

  @Column({ nullable: false })
  country_id: number;

  @ManyToOne(() => CountryEntity, (countries) => countries.id)
  @JoinColumn({ name: 'country_id' })
  countries: CountryEntity;

  @Column({ nullable: false })
  venue: string;
  @Column({ nullable: false })
  venue_latitude: string;
  @Column({ nullable: false })
  venue_longitude: string;
  @Column({ nullable: false })
  event_description: string;

  @Column({ nullable: false })
  featured_image: string;
  @Column({
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  event_date_from: Date;
  @Column({ nullable: true })
  event_time_from: string;
  @Column({ nullable: true })
  event_date_to: Date;
  @Column({ nullable: true })
  event_time_to: string;
  @Column({ nullable: true })
  total_seats: number;
  @Column({ nullable: true })
  merchant_id: number;
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
  agent_commission: number;
  @Column('double precision', { nullable: true, default: 0 })
  single_ticket_price: number;

  @Column({ nullable: true })
  event_type: number; //1- online,2-offline
  @Column({ nullable: true })
  event_ticket_status: number; //1- selling fast,2-sold out 3 - upcoming

  @Column({ nullable: true })
  about_the_event: string;
  @Column({ nullable: true })
  detailed_address: string;
  @Column({ nullable: true })
  contact_details: string;
  @Column({ nullable: true })
  event_subscription_status: number; //1-free event,2-paid
  @Column({ nullable: true })
  additional_venue_address: string; //1-free event,2-paid
  @Column({ nullable: true })
  about_the_event_title: string; //1-free event,2-paid

  @Column({ nullable: true })
  map_url: string;

  @Column({ nullable: true })
  banner_image: string;
  @Column({ nullable: true })
  available_seats: number;

  @Column({ nullable: true })
  contact_ph: string;
  @Column({ nullable: true })
  contact_email: string;

  @Column({ nullable: true })
  city_id: number;

  @ManyToOne(() => LocationEntity, (location) => location.id)
  @JoinColumn({ name: 'city_id' })
  location: LocationEntity;
  @Column({ nullable: true })
  agent_ids: string;
}
