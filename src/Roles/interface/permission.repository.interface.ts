import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { PermissionEntity } from 'src/typeOrm/entities/Permissions';
export type PermissionRepositoryInterface =
  BaseInterfaceRepository<PermissionEntity>;
