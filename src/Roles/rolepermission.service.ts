import { Observable, catchError, from, throwError } from 'rxjs';
import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Inject,
  Logger,
} from '@nestjs/common';
import { AddRoleDto } from './dto/addrole.dto';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { ResponsesData } from 'src/common/library/response.data';
import { RoleRepositoryInterface } from './interface/roles.repository.interface';
import { PermissionRepositoryInterface } from './interface/permission.repository.interface';
import { ModuleRepositoryInterface } from './interface/module.repository.interface';
import { RolePermissionRepositoryInterface } from './interface/rolepermission.repository.interface';

@Injectable()
export class RolePermissionService {
  constructor(
    private readonly commonValidation: CommonValidation,
    private readonly responses: ResponsesData,
    @Inject('RoleRepositoryInterface')
    private readonly roleRepository: RoleRepositoryInterface,
    @Inject('PermissionRepositoryInterface')
    private readonly permissionRepository: PermissionRepositoryInterface,
    @Inject('ModuleRepositoryInterface')
    private readonly moduleRepository: ModuleRepositoryInterface,
    @Inject('RolePermissionRepositoryInterface')
    private readonly rolePermissionRepository: RolePermissionRepositoryInterface,
  ) {}
  async addRole(addRoleDto: AddRoleDto) {}
}
