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
import { PermissionEntity } from './Permissions';

@Entity({ name: 'role_permissions' })
export class RolePermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  roleId: number;

  @ManyToOne(() => RolesEntity, (role) => role.id)
  @JoinColumn({ name: 'roleId' })
  role: RolesEntity;

  @Column({ nullable: false })
  permissionId: number;

  @ManyToOne(() => PermissionEntity, (permissions) => permissions.id)
  @JoinColumn({ name: 'permissionId' })
  permissions: PermissionEntity;

  @Column({ default: false })
  hasPermission: boolean;

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
