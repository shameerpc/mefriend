/* eslint-disable prettier/prettier */
import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { CategoryTypeEntity } from './CategoryType';
import slugify from 'slugify';
import { UserEntity } from './User';
@Index('UQ_slug', ['slug'], { unique: true, where: 'deleted_at IS NULL' })
@Entity({ name: 'category' })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  sub_title: string;

  // @Column({ nullable: true })
  // category_type: number;

  // // Establish Many-to-One relationship with AwardEntity
  // @ManyToOne(() => CategoryTypeEntity, (categorytype) => categorytype.id)
  // @JoinColumn({ name: 'category_type' })
  // categorytype: CategoryTypeEntity;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false })
  slug: string;
  @BeforeInsert()
  generateSlug() {
    this.slug = slugify(this.title, {
      lower: true,
      remove: /[^a-zA-Z0-9]+/g,
      replacement: '-',
    });
  }

  @Column({ nullable: false })
  image: string;

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

  @Column({ nullable: true })
  sort_order: number;

  @Column({ nullable: false })
  created_by: number;
  @ManyToOne(() => UserEntity, (users) => users.id)
  @JoinColumn({ name: 'created_by' })
  users: UserEntity;
}
