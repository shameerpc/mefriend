import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Inject,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionRepositoryInterface } from 'src/Roles/interface/permission.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { UserRole } from 'src/common/enum/user-role.enum';
import { RolePermissionRepositoryInterface } from 'src/Roles/interface/rolepermission.repository.interface';
import { MultipartAuthGuard } from './multipart-auth.guard';
import { UserRepositoryInterface } from 'src/admin/user/interface/user.repository.interface';
import { Status } from 'src/common/enum/status.enum';
@UseGuards(MultipartAuthGuard)
@Injectable()
export class MultipartPermissionsGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @Inject('PermissionRepositoryInterface')
    private readonly permissionRepository: PermissionRepositoryInterface,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('RolePermissionRepositoryInterface')
    private readonly rolePermissionRepository: RolePermissionRepositoryInterface,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: `${process.env.JWT_SECRET}`,
      });
      const getRole = await this.userRepository.findOneById(payload.user_id);
      if (!getRole) throw new UnauthorizedException('Unauthorized');

      //accessed permission
      const requiredPermissions =
        this.reflector.get('permissions', context.getHandler()) || [];
      let isExistPermsn: any;
      if (requiredPermissions.length > 0) {
        const permId: any = await this.permissionRepository.findByCondition({
          permissionName: requiredPermissions[0],
        });
        const condition: any = {
          permissionId: permId[0].id,
          hasPermission: true,
          roleId: Number(getRole.user_role),
          delete_status: 0,
          status: Status.Active,
        };
        isExistPermsn =
          this.rolePermissionRepository.findByCondition(condition);
      }
      const hasPerm = await isExistPermsn;
      console.log(hasPerm);

      if (
        requiredPermissions.length === 0 ||
        hasPerm.length > 0 ||
        Number(getRole.user_role) === UserRole.SUPERADMIN
      ) {
        return true;
      }

      throw new ForbiddenException('Insufficient Permissions');
    } catch {}
  }
  private extractTokenFromHeader(authorization: string): string | undefined {
    const [type, token] = authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
