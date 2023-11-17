import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { RolesEntity } from './Roles';
import { ModuleEntity } from './Modules';

@Entity({ name: 'permissions' })
export class PermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  moduleId: number;

  @ManyToOne(() => ModuleEntity, (modules) => modules.id)
  @JoinColumn({ name: 'moduleId' })
  modules: RolesEntity;

  @Column({ nullable: false })
  permissionName: string;

  @Column({ default: 1 })
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
