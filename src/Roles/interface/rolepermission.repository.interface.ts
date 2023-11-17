import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { RolePermissionEntity } from 'src/typeOrm/entities/RolePermissions';
export type RolePermissionRepositoryInterface =
  BaseInterfaceRepository<RolePermissionEntity>;
