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
import { GetRoleDto } from './dto/getrole.dto';
import { AddPermissionDto } from './dto/addpermission.dto';
import { add } from 'winston';
import { GetPermissionDto } from './dto/getpermission.dto';
import { DeleteRoleDto } from './dto/deleterole.dto';
import { Not, In } from 'typeorm';
import { DeletePermissionDto } from './dto/deletepermission.dto';
import { UserRole } from 'src/common/enum/user-role.enum';
import { Status } from 'src/common/enum/status.enum';
import { UserRepositoryInterface } from 'src/admin/user/interface/user.repository.interface';
import { CommonServices } from 'src/common/services/common.service';
import { GetAllPermissionDto } from './dto/getallpermission.dto';
@Injectable()
export class RoleService {
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
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    private readonly logger: Logger,
    private readonly commonServices: CommonServices,
  ) {}
  async addRole(addRoleDto: AddRoleDto) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(addRoleDto.user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      const role_datam = {
        role_name: addRoleDto.title,
      };

      if (addRoleDto.role_id) {
        if (
          addRoleDto.role_id === UserRole.SUPERADMIN ||
          addRoleDto.role_id === UserRole.USER
        )
          return this.responses.errorResponse('Cant add this roles');
        const existingEntity = await this.roleRepository.findByCondition({
          role_name: addRoleDto.title,
          id: Not(addRoleDto.role_id),
        });
        if (existingEntity.length > 0) {
          return this.responses.errorResponse('Role name should be unique');
        }

        //update role
        const updateData = await this.roleRepository.findAndUpdate(
          { id: addRoleDto.role_id },
          role_datam,
        );

        if (updateData) return this.responses.successResponse(updateData);
        return this.responses.errorResponse('Something went wrong');
      } else {
        const existingEntity = await this.roleRepository.findByCondition({
          role_name: addRoleDto.title,
        });
        if (existingEntity.length > 0) {
          return this.responses.errorResponse('Role name should be unique');
        }

        //update role
        const updateData = await this.roleRepository.save(role_datam);

        if (updateData) return this.responses.successResponse(updateData);
        return this.responses.errorResponse('Something went wrong');
      }
    } catch (error) {
      this.logger.error(error.message, error.stack, 'RoleService.addRole');
      throw error;
    }
  }

  async getRole({ user_id, role_id, page, limit }: GetRoleDto, merchant: any) {
    try {
      // console.log(merchant.user.merchant, 'p');
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      const offset = page ? page : 1;
      const lmt = limit ? limit : 12;
      const actualLimit = limit ? Number(limit) : 10;
      const getData = await this.roleRepository.findByConditionWithPagination(
        {
          delete_status: 0,
          id: role_id ? role_id : Not(In([UserRole.SUPERADMIN, UserRole.USER])),
        },
        offset,
        lmt ? lmt : 10,
        'id: desc',
      );

      const datam =
        getData.data.length > 0
          ? getData.data.map((data: any) => {
              const result = {
                id: data.id,
                name: data.role_name,
              };
              return result;
            })
          : [];
      const pagination = {
        page: offset,
        limit: actualLimit,
        total: getData.total,
      };
      if (datam) {
        const response = {
          role_data: await Promise.all(datam),
          pagination,
        };
        return this.responses.successResponse(response);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(error.message, error.stack, 'RoleService.getRole');
      throw error;
    }
  }

  async getRoleUser(
    { user_id, role_id, page, limit }: GetRoleDto,
    merchant: any,
  ) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      const offset = page ? page : 1;
      const lmt = limit ? limit : 12;
      const actualLimit = limit ? Number(limit) : 10;
      const getData = await this.roleRepository.findByConditionWithPagination(
        {
          delete_status: 0,
          id: role_id ? role_id : Not(In([UserRole.SUPERADMIN])),
        },
        offset,
        lmt ? lmt : 10,
        'id: desc',
      );

      const datam =
        getData.data.length > 0
          ? getData.data.map((data: any) => {
              const result = {
                id: data.id,
                name: data.role_name,
              };
              return result;
            })
          : [];
      const pagination = {
        page: offset,
        limit: actualLimit,
        total: getData.total,
      };
      if (datam) {
        const response = {
          role_data: await Promise.all(datam),
          pagination,
        };
        return this.responses.successResponse(response);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(error.message, error.stack, 'RoleService.getRoleUser');
      throw error;
    }
  }
  async deleteRole({ user_id, role_ids }: DeleteRoleDto) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      if (role_ids.length < 1)
        return this.responses.errorResponse('Role ids should not be empty');
      const checkExist: any = await this.commonServices.checkIdsExistOrNot(
        role_ids,
        'roles',
      );

      if (!checkExist)
        return this.responses.errorResponse('Please check roles');

      const successResults = [];
      for (const roleId of role_ids) {
        const deleteRoles = this.roleRepository.delete(roleId);
        if (deleteRoles) {
          successResults.push({
            id: roleId,
            status: true,
            message: 'Roles deleted successfully',
          });
        } else {
          successResults.push({
            id: roleId,
            status: false,
            message: 'Deletion failed',
          });
        }
      }

      const allDeletedSuccessfully = successResults.every(
        (result) => result.status,
      );

      if (allDeletedSuccessfully) {
        return this.responses.successResponse({}, 'Roles deleted successfully');
      } else {
        return this.responses.errorResponse('Deletion Failed');
      }
    } catch (error) {
      this.logger.error(error.message, error.stack, 'RoleService.deleteRole');
      throw error;
    }
  }

  async addPermission(addPermissionDto: AddPermissionDto) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(addPermissionDto.user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      const checkAlreadyExist =
        await this.rolePermissionRepository.findByCondition({
          roleId: addPermissionDto.roleId,
          permissionId: addPermissionDto.permissionId,
          hasPermission: addPermissionDto.hasPermission,
        });
      if (checkAlreadyExist.length > 0)
        return this.responses.errorResponse('Already added');
      if (addPermissionDto.rolePermissionId) {
        //update role

        const updateData = await this.rolePermissionRepository.findAndUpdate(
          { id: addPermissionDto.rolePermissionId },
          {
            roleId: addPermissionDto.roleId,
            permissionId: addPermissionDto.permissionId,
            hasPermission: addPermissionDto.hasPermission,
          },
        );

        if (updateData) return this.responses.successResponse(updateData);
        return this.responses.errorResponse('Something went wrong');
      } else {
        //update permission
        const updateData = await this.rolePermissionRepository.save({
          roleId: addPermissionDto.roleId,
          permissionId: addPermissionDto.permissionId,
          hasPermission: addPermissionDto.hasPermission,
        });

        if (updateData) return this.responses.successResponse(updateData);
        return this.responses.errorResponse('Something went wrong');
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'RoleService.addPermission',
      );
      throw error;
    }
  }
  //get permissions
  async getRolePermissions({
    user_id,
    permission_id,
    page,
    limit,
    role_id,
  }: GetPermissionDto) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      const offset = page ? page : 1;
      const lmt = limit ? limit : 12;
      const actualLimit = limit ? Number(limit) : 10;

      const getData =
        await this.rolePermissionRepository.findByConditionWithPagination(
          {
            delete_status: 0,
            id: permission_id ?? permission_id,
            roleId: role_id ?? role_id,
          },
          offset,
          lmt ? lmt : 10,
          'id:desc',
        );
      const datam =
        getData.data.length > 0
          ? getData.data.map(async (data: any) => {
              const permission = await this.commonServices.getPermissionName(
                data.permissionId,
              );
              const role = await this.commonServices.getRoleName(data.roleId);
              const result = {
                id: data.id,
                permission: permission,
                permission_id: data.permissionId,
                role: role,
                role_id: data.roleId,
                status: data.status,
                hasPermission: data.hasPermission,
              };
              return result;
            })
          : [];
      const pagination = {
        page: offset,
        limit: actualLimit,
        total: getData.total,
      };
      if (datam) {
        const response = {
          role_data: await Promise.all(datam),
          pagination,
        };
        return this.responses.successResponse(response);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'RoleService.getRolePermissions',
      );
      throw error;
    }
  }

  async deleteRolePermission({ user_id, permissionIds }: DeletePermissionDto) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }

      if (permissionIds.length < 1)
        return this.responses.errorResponse(
          'Permission ids should not be empty',
        );
      const checkExist: any = await this.commonServices.checkIdsExistOrNot(
        permissionIds,
        'permission',
      );

      if (!checkExist)
        return this.responses.errorResponse('Please check permissions');

      const successResults = [];
      for (const permissionId of permissionIds) {
        const deleteRoles = await this.rolePermissionRepository.delete(
          permissionId,
        );
        if (deleteRoles) {
          successResults.push({
            id: permissionId,
            status: true,
            message: 'Permissions deleted successfully',
          });
        } else {
          successResults.push({
            id: permissionId,
            status: false,
            message: 'Deletion failed',
          });
        }
      }

      const allDeletedSuccessfully = successResults.every(
        (result) => result.status,
      );

      if (allDeletedSuccessfully) {
        return this.responses.successResponse(
          {},
          'Permissions deleted successfully',
        );
      } else {
        return this.responses.errorResponse('Deletion Failed');
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'RoleService.deleteRolePermission',
      );
      throw error;
    }
  }
  async getAllPermissions({ user_id, limit, page }: GetAllPermissionDto) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }

      const offset = page ? page : 1;
      const lmt = limit ? limit : 12;
      const actualLimit = limit ? Number(limit) : 10;

      const getData =
        await this.permissionRepository.findByConditionWithPagination(
          {
            delete_status: 0,
          },
          offset,
          lmt ? lmt : 10,
        );
      const datam =
        getData.data.length > 0
          ? getData.data.map(async (data: any) => {
              const module = await this.commonServices.getModuleName(
                data.moduleId,
              );
              const result = {
                id: data.id,
                permission: data.permissionName,
                moduleid: data.moduleId,
                module: module,
                status: data.status,
                hasPermission: data.hasPermission,
              };
              return result;
            })
          : [];
      const pagination = {
        page: offset,
        limit: actualLimit,
        total: getData.total,
      };
      if (datam) {
        const response = {
          permission_data: await Promise.all(datam),
          pagination,
        };
        return this.responses.successResponse(response);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'RoleService.getAllPermissions',
      );
      throw error;
    }
  }
}
