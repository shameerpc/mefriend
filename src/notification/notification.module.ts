import { Logger, Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationRepository } from 'src/repositories/notification.repository';
import { NotificationEntity } from 'src/typeOrm/entities/Notitfication';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponsesData } from 'src/common/library/response.data';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { UserRepository } from 'src/repositories/user.repository';
import { UserOtpRepository } from 'src/repositories/userotp.repository';
import { UserEntity } from 'src/typeOrm/entities/User';
import { UserOtpEntity } from 'src/typeOrm/entities/UserOtp';
import { PermissionEntity } from 'src/typeOrm/entities/Permissions';
import { JwtTokenEntity } from 'src/typeOrm/entities/JwtToken';
import { RolePermissionEntity } from 'src/typeOrm/entities/RolePermissions';
import { JwtTokenRepository } from 'src/repositories/jwttoken.repository';
import { PermissionRepository } from 'src/repositories/permission.repository';
import { RolePermissionRepository } from 'src/repositories/rolepermission.repository';
import { MerchantRepository } from 'src/repositories/merchant.repository';
import { MerchantEntity } from 'src/typeOrm/entities/Merchants';
import { ModuleEntity } from 'src/typeOrm/entities/Modules';
import { RoleRepository } from 'src/repositories/role.repository';
import { ModuleRepository } from 'src/repositories/module.repository';
import { RolesEntity } from 'src/typeOrm/entities/Roles';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([UserOtpEntity]),
    TypeOrmModule.forFeature([JwtTokenEntity]),
    TypeOrmModule.forFeature([PermissionEntity]),
    TypeOrmModule.forFeature([RolePermissionEntity]),
    TypeOrmModule.forFeature([ModuleEntity]),
    TypeOrmModule.forFeature([MerchantEntity]),
    TypeOrmModule.forFeature([RolesEntity]),
    TypeOrmModule.forFeature([NotificationEntity]),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    {
      provide: 'NotificationRepositoryInterface',
      useClass: NotificationRepository,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'UserOtpRepositoryInterface',
      useClass: UserOtpRepository,
    },
    {
      provide: 'JwtTokenRepositoryInterface',
      useClass: JwtTokenRepository,
    },
    {
      provide: 'PermissionRepositoryInterface',
      useClass: PermissionRepository,
    },
    {
      provide: 'RolePermissionRepositoryInterface',
      useClass: RolePermissionRepository,
    },
    {
      provide: 'MerchantRepositoryInterface',
      useClass: MerchantRepository,
    },
    {
      provide: 'RoleRepositoryInterface',
      useClass: RoleRepository,
    },
    {
      provide: 'ModuleRepositoryInterface',
      useClass: ModuleRepository,
    },
    ResponsesData,
    Logger,
    CommonValidation,
  ],
})
export class NotificationModule {}
