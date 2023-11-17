import { Module, NestModule, MiddlewareConsumer, Logger } from '@nestjs/common';
import { MerchantController } from './merchant.controller';
import { PermissionRepository } from 'src/repositories/permission.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from 'src/typeOrm/entities/Permissions';
import { UserRepository } from 'src/repositories/user.repository';
import { UserEntity } from 'src/typeOrm/entities/User';
import { RolePermissionEntity } from 'src/typeOrm/entities/RolePermissions';
import { RolePermissionRepository } from 'src/repositories/rolepermission.repository';
import { JwtTokenRepository } from 'src/repositories/jwttoken.repository';
import { JwtTokenEntity } from 'src/typeOrm/entities/JwtToken';
import { MerchantKeyServices } from './merchant.service';
import { CommonServices } from 'src/common/services/common.service';
import { MerchantRepository } from 'src/repositories/merchant.repository';
import { MerchantEntity } from 'src/typeOrm/entities/Merchants';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { ResponsesData } from 'src/common/library/response.data';
import { UserOtpRepository } from 'src/repositories/userotp.repository';
import { UserOtpEntity } from 'src/typeOrm/entities/UserOtp';
import { ModuleRef } from '@nestjs/core';
import { ModuleRepository } from 'src/repositories/module.repository';
import { ModuleEntity } from 'src/typeOrm/entities/Modules';
import { CategoryRepository } from 'src/repositories/category.repository';
import { CategoryEntity } from 'src/typeOrm/entities/Category';
import { TicketTypeRepository } from 'src/repositories/ticketType.repository';
import { EventTicketRepository } from 'src/repositories/eventticket.repository';
import { TicketTypeEntity } from 'src/typeOrm/entities/TicketType';
import { EventTicketEntity } from 'src/typeOrm/entities/EventTicket';
import { RoleRepository } from 'src/repositories/role.repository';
import { RolesEntity } from 'src/typeOrm/entities/Roles';
import { EventRepository } from 'src/repositories/event.repository';
import { EventEntity } from 'src/typeOrm/entities/Event';
import { FormRepository } from 'src/repositories/form.repository';
import { FormEntity } from 'src/typeOrm/entities/Forms';
import { QuestionRepository } from 'src/repositories/question.repository';
import { QuestionEntity } from 'src/typeOrm/entities/Questions';

@Module({
  controllers: [MerchantController],
  imports: [
    TypeOrmModule.forFeature([PermissionEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([RolePermissionEntity]),
    TypeOrmModule.forFeature([JwtTokenEntity]),
    TypeOrmModule.forFeature([MerchantEntity]),
    TypeOrmModule.forFeature([UserOtpEntity]),
    TypeOrmModule.forFeature([ModuleEntity]),
    TypeOrmModule.forFeature([CategoryEntity]),
    TypeOrmModule.forFeature([TicketTypeEntity]),
    TypeOrmModule.forFeature([EventTicketEntity]),
    TypeOrmModule.forFeature([RolesEntity]),
    TypeOrmModule.forFeature([EventEntity]),
    TypeOrmModule.forFeature([FormEntity]),
    TypeOrmModule.forFeature([QuestionEntity]),
  ],

  providers: [
    {
      provide: 'PermissionRepositoryInterface',
      useClass: PermissionRepository,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'RolePermissionRepositoryInterface',
      useClass: RolePermissionRepository,
    },
    {
      provide: 'JwtTokenRepositoryInterface',
      useClass: JwtTokenRepository,
    },
    {
      provide: 'MerchantRepositoryInterface',
      useClass: MerchantRepository,
    },
    {
      provide: 'UserOtpRepositoryInterface',
      useClass: UserOtpRepository,
    },
    {
      provide: 'ModuleRepositoryInterface',
      useClass: ModuleRepository,
    },
    {
      provide: 'CategoryRepositoryInterface',
      useClass: CategoryRepository,
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
    Logger,
    MerchantKeyServices,
    CommonServices,
    CommonValidation,
    ResponsesData,
  ],
})
export class MerchantModule {}
