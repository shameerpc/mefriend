/* eslint-disable prettier/prettier */
import { Logger, Module } from '@nestjs/common';
import { ResponsesData } from 'src/common/library/response.data';
import { CommonServices } from 'src/common/services/common.service';
import { couponController } from './coupon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOtpRepository } from 'src/repositories/userotp.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { UserEntity } from 'src/typeOrm/entities/User';
import { UserOtpEntity } from 'src/typeOrm/entities/UserOtp';

import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { JwtTokenRepository } from 'src/repositories/jwttoken.repository';
import { JwtTokenEntity } from 'src/typeOrm/entities/JwtToken';
import { PermissionRepository } from 'src/repositories/permission.repository';
import { PermissionEntity } from 'src/typeOrm/entities/Permissions';
import { RolePermissionRepository } from 'src/repositories/rolepermission.repository';
import { RolePermissionEntity } from 'src/typeOrm/entities/RolePermissions';
import { ModuleEntity } from 'src/typeOrm/entities/Modules';
import { ModuleRepository } from 'src/repositories/module.repository';
import { CouponEntity } from 'src/typeOrm/entities/Coupon';
import { CouponService } from './coupon.service';
import { CouponRepository } from 'src/repositories/coupon.repository';
import { CategoryRepository } from 'src/repositories/category.repository';
import { CategoryEntity } from 'src/typeOrm/entities/Category';
import { CouponResponseData } from './response/coupon-response';
import { MerchantRepository } from 'src/repositories/merchant.repository';
import { MerchantEntity } from 'src/typeOrm/entities/Merchants';
import { TicketTypeEntity } from 'src/typeOrm/entities/TicketType';
import { EventTicketEntity } from 'src/typeOrm/entities/EventTicket';
import { TicketTypeRepository } from 'src/repositories/ticketType.repository';
import { EventTicketRepository } from 'src/repositories/eventticket.repository';
import { RoleRepository } from 'src/repositories/role.repository';
import { RolesEntity } from 'src/typeOrm/entities/Roles';
import { EventEntity } from 'src/typeOrm/entities/Event';
import { EventRepository } from 'src/repositories/event.repository';
import { FormRepository } from 'src/repositories/form.repository';
import { FormEntity } from 'src/typeOrm/entities/Forms';
import { QuestionEntity } from 'src/typeOrm/entities/Questions';
import { QuestionRepository } from 'src/repositories/question.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CouponEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([UserOtpEntity]),
    TypeOrmModule.forFeature([JwtTokenEntity]),
    TypeOrmModule.forFeature([PermissionEntity]),
    TypeOrmModule.forFeature([RolePermissionEntity]),
    TypeOrmModule.forFeature([ModuleEntity]),
    TypeOrmModule.forFeature([CategoryEntity]),
    TypeOrmModule.forFeature([MerchantEntity]),
    TypeOrmModule.forFeature([TicketTypeEntity]),
    TypeOrmModule.forFeature([EventTicketEntity]),
    TypeOrmModule.forFeature([RolesEntity]),
    TypeOrmModule.forFeature([EventEntity]),
    TypeOrmModule.forFeature([FormEntity]),
    TypeOrmModule.forFeature([QuestionEntity]),
  ],

  controllers: [couponController],
  providers: [
    CouponService,
    CommonServices,
    {
      provide: 'couponRepositoryInterface',
      useClass: CouponRepository,
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
      provide: 'ModuleRepositoryInterface',
      useClass: ModuleRepository,
    },
    {
      provide: 'CouponRepositoryInterface',
      useClass: CouponRepository,
    },
    {
      provide: 'CategoryRepositoryInterface',
      useClass: CategoryRepository,
    },
    {
      provide: 'MerchantRepositoryInterface',
      useClass: MerchantRepository,
    },
    {
      provide: 'TicketTypeRepositoryInterface',
      useClass: TicketTypeRepository,
    },
    {
      provide: 'EventTicketRepositoryInterface',
      useClass: EventTicketRepository,
    },
    {
      provide: 'RoleRepositoryInterface',
      useClass: RoleRepository,
    },
    {
      provide: 'EventRepositoryInterface',
      useClass: EventRepository,
    },
    {
      provide: 'FormRepositoryInterface',
      useClass: FormRepository,
    },
    {
      provide: 'QuestionRepositoryInterface',
      useClass: QuestionRepository,
    },
    ResponsesData,
    Logger,
    CommonServices,
    CommonValidation,
    CouponResponseData,
  ],
})
export class CouponModule {}
