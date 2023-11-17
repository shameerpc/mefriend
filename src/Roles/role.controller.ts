import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
  UsePipes,
  HttpCode,
  Query,
  SetMetadata,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AddRoleDto } from './dto/addrole.dto';
import { RoleService } from './role.service';
import { GetRoleDto } from './dto/getrole.dto';
import { AddPermissionDto } from './dto/addpermission.dto';
import { GetPermissionDto } from './dto/getpermission.dto';
import { DeletePermissionDto } from './dto/deletepermission.dto';
import { DeleteRoleDto } from './dto/deleterole.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { GetAllPermissionDto } from './dto/getallpermission.dto';

@ApiTags('Role Management')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseGuards(PermissionsGuard)
@Controller()
export class RolesController {
  constructor(private roleService: RoleService) {}

  @Post('role/add-role')
  @SetMetadata('permissions', ['write-role'])
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  create(@Body() role: AddRoleDto): Promise<any> {
    return this.roleService.addRole(role);
  }

  @Post('role/get-role')
  @SetMetadata('permissions', ['read-role'])
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  getRoles(@Req() merchant, @Body() role: GetRoleDto): Promise<any> {
    return this.roleService.getRole(role, merchant);
  }

  @Post('role/get-role-user')
  @SetMetadata('permissions', ['read-role'])
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  getUserRoles(@Req() merchant, @Body() role: GetRoleDto): Promise<any> {
    return this.roleService.getRoleUser(role, merchant);
  }

  @Post('role/delete-role')
  @SetMetadata('permissions', ['delete-role'])
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  deleteRoles(@Body() role: DeleteRoleDto): Promise<any> {
    return this.roleService.deleteRole(role);
  }

  //permissions apis goes below
  @Post('permission/add-permission')
  @SetMetadata('permissions', ['write-permission'])
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  addPermission(@Body() role: AddPermissionDto): Promise<any> {
    return this.roleService.addPermission(role);
  }

  @Post('permission/get-role-permission')
  @SetMetadata('permissions', ['read-permission'])
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  getPermission(@Body() role: GetPermissionDto): Promise<any> {
    return this.roleService.getRolePermissions(role);
  }

  @Post('permission/delete-role-permission')
  @SetMetadata('permissions', ['delete-permission'])
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  deleteRolePermission(@Body() role: DeletePermissionDto): Promise<any> {
    return this.roleService.deleteRolePermission(role);
  }

  @Post('permission/get-all-permission')
  @SetMetadata('permissions', ['read-permission'])
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  getAllPermission(@Body() role: GetAllPermissionDto): Promise<any> {
    return this.roleService.getAllPermissions(role);
  }
}
