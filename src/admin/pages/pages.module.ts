/* eslint-disable prettier/prettier */
import { Logger, Module } from '@nestjs/common';
import { ResponsesData } from 'src/common/library/response.data';
import { CommonServices } from 'src/common/services/common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOtpRepository } from 'src/repositories/userotp.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { UserEntity } from 'src/typeOrm/entities/User';
import { UserOtpEntity } from 'src/typeOrm/entities/UserOtp';
import { PagesController } from './pages.controller';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { JwtTokenRepository } from 'src/repositories/jwttoken.repository';
import { JwtTokenEntity } from 'src/typeOrm/entities/JwtToken';
import { PermissionRepository } from 'src/repositories/permission.repository';
import { PermissionEntity } from 'src/typeOrm/entities/Permissions';
import { RolePermissionRepository } from 'src/repositories/rolepermission.repository';
import { RolePermissionEntity } from 'src/typeOrm/entities/RolePermissions';
import { ModuleEntity } from 'src/typeOrm/entities/Modules';
import { ModuleRepository } from 'src/repositories/module.repository';
import { EventTicketEntity } from 'src/typeOrm/entities/EventTicket';
import { EventTicketRepository } from 'src/repositories/eventticket.repository';
import { CategoryRepository } from 'src/repositories/category.repository';
import { CategoryEntity } from 'src/typeOrm/entities/Category';
import { MerchantRepository } from 'src/repositories/merchant.repository';
import { MerchantEntity } from 'src/typeOrm/entities/Merchants';
import { TicketTypeRepository } from 'src/repositories/ticketType.repository';
import { TicketTypeEntity } from 'src/typeOrm/entities/TicketType';
import { RoleRepository } from 'src/repositories/role.repository';
import { RolesEntity } from 'src/typeOrm/entities/Roles';
import { PageRepository } from 'src/repositories/page.repository';
import { PageEntity } from 'src/typeOrm/entities/Page';
import { PagesService } from './pages.service';
import { PageResponseData } from './response/page-response';
import { EventRepository } from 'src/repositories/event.repository';
import { FormRepository } from 'src/repositories/form.repository';
import { QuestionRepository } from 'src/repositories/question.repository';
import { EventEntity } from 'src/typeOrm/entities/Event';
import { FormEntity } from 'src/typeOrm/entities/Forms';
import { QuestionEntity } from 'src/typeOrm/entities/Questions';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventTicketEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([UserOtpEntity]),
    TypeOrmModule.forFeature([JwtTokenEntity]),
    TypeOrmModule.forFeature([PermissionEntity]),
    TypeOrmModule.forFeature([RolePermissionEntity]),
    TypeOrmModule.forFeature([ModuleEntity]),
    TypeOrmModule.forFeature([CategoryEntity]),
    TypeOrmModule.forFeature([MerchantEntity]),
    TypeOrmModule.forFeature([PageEntity]),
    TypeOrmModule.forFeature([TicketTypeEntity]),
    TypeOrmModule.forFeature([RolesEntity]),
    TypeOrmModule.forFeature([EventEntity]),
    TypeOrmModule.forFeature([FormEntity]),
    TypeOrmModule.forFeature([QuestionEntity]),
  ],

  controllers: [PagesController],
  providers: [
    PagesService,
    CommonServices,
    {
      provide: 'EventTicketRepositoryInterface',
      useClass: EventTicketRepository,
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
      provide: 'PageRepositoryInterface',
      useClass: PageRepository,
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
    {
      provide: 'EventRepositoryInterface',
      useClass: EventRepository,
    },

    ResponsesData,
    Logger,
    CommonServices,
    CommonValidation,
    PageResponseData,
  ],
})
export class PagesModule {}
