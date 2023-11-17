/* eslint-disable prettier/prettier */
import { Logger, Module } from '@nestjs/common';
import { ResponsesData } from 'src/common/library/response.data';
import { CommonServices } from 'src/common/services/common.service';
import { CategoryService } from './category.service';
import { CategoryRepository } from 'src/repositories/category.repository';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/typeOrm/entities/Category';
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
import { CategoryResponseData } from './response/category-response';
import { MerchantRepository } from 'src/repositories/merchant.repository';
import { MerchantEntity } from 'src/typeOrm/entities/Merchants';
import { TicketTypeRepository } from 'src/repositories/ticketType.repository';
import { EventTicketRepository } from 'src/repositories/eventticket.repository';
import { EventTicketEntity } from 'src/typeOrm/entities/EventTicket';
import { TicketTypeEntity } from 'src/typeOrm/entities/TicketType';
import { RolesEntity } from 'src/typeOrm/entities/Roles';
import { RoleRepository } from 'src/repositories/role.repository';
import { EventRepository } from 'src/repositories/event.repository';
import { EventEntity } from 'src/typeOrm/entities/Event';
import { FormEntity } from 'src/typeOrm/entities/Forms';
import { FormRepository } from 'src/repositories/form.repository';
import { QuestionRepository } from 'src/repositories/question.repository';
import { QuestionEntity } from 'src/typeOrm/entities/Questions';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([UserOtpEntity]),
    TypeOrmModule.forFeature([JwtTokenEntity]),
    TypeOrmModule.forFeature([PermissionEntity]),
    TypeOrmModule.forFeature([RolePermissionEntity]),
    TypeOrmModule.forFeature([ModuleEntity]),
    TypeOrmModule.forFeature([MerchantEntity]),
    TypeOrmModule.forFeature([TicketTypeEntity]),
    TypeOrmModule.forFeature([EventTicketEntity]),
    TypeOrmModule.forFeature([RolesEntity]),
    TypeOrmModule.forFeature([EventEntity]),
    TypeOrmModule.forFeature([FormEntity]),
    TypeOrmModule.forFeature([QuestionEntity]),
  ],

  controllers: [CategoryController],
  providers: [
    CategoryService,
    CommonServices,
    {
      provide: 'CategoryRepositoryInterface',
      useClass: CategoryRepository,
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
    CategoryResponseData,
  ],
})
export class CategoryModule {}
