import { Logger, Module } from '@nestjs/common';
import { SupportTicketsController } from './support-tickets.controller';
import { SupportTicketsService } from './support-tickets.service';
import { SupportTicketsEntity } from 'src/typeOrm/entities/SupportTickets';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportTicketRepository } from 'src/repositories/supportticket.repository';
import { CommonServices } from 'src/common/services/common.service';
import { ResponsesData } from 'src/common/library/response.data';
import { UserRepository } from 'src/repositories/user.repository';
import { UserOtpRepository } from 'src/repositories/userotp.repository';
import { RolePermissionRepository } from 'src/repositories/rolepermission.repository';
import { PermissionRepository } from 'src/repositories/permission.repository';
import { ModuleRepository } from 'src/repositories/module.repository';
import { CategoryRepository } from 'src/repositories/category.repository';
import { CategoryEntity } from 'src/typeOrm/entities/Category';
import { UserEntity } from 'src/typeOrm/entities/User';
import { UserOtpEntity } from 'src/typeOrm/entities/UserOtp';
import { JwtTokenEntity } from 'src/typeOrm/entities/JwtToken';
import { PermissionEntity } from 'src/typeOrm/entities/Permissions';
import { RolePermissionEntity } from 'src/typeOrm/entities/RolePermissions';
import { ModuleEntity } from 'src/typeOrm/entities/Modules';
import { JwtTokenRepository } from 'src/repositories/jwttoken.repository';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { TicketData } from './library/tickets.data';
import { TicketCommentRepository } from 'src/repositories/ticketcomment.repository';
import { TicketCommentsEntity } from 'src/typeOrm/entities/TicketComments';
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
import { FormEntity } from 'src/typeOrm/entities/Forms';
import { FormRepository } from 'src/repositories/form.repository';
import { QuestionEntity } from 'src/typeOrm/entities/Questions';
import { QuestionRepository } from 'src/repositories/question.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupportTicketsEntity]),
    TypeOrmModule.forFeature([CategoryEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([UserOtpEntity]),
    TypeOrmModule.forFeature([JwtTokenEntity]),
    TypeOrmModule.forFeature([PermissionEntity]),
    TypeOrmModule.forFeature([RolePermissionEntity]),
    TypeOrmModule.forFeature([ModuleEntity]),
    TypeOrmModule.forFeature([TicketCommentsEntity]),
    TypeOrmModule.forFeature([MerchantEntity]),
    TypeOrmModule.forFeature([TicketTypeEntity]),
    TypeOrmModule.forFeature([EventTicketEntity]),
    TypeOrmModule.forFeature([RolesEntity]),
    TypeOrmModule.forFeature([EventEntity]),
    TypeOrmModule.forFeature([FormEntity]),
    TypeOrmModule.forFeature([QuestionEntity]),
  ],
  controllers: [SupportTicketsController],
  providers: [
    SupportTicketsService,
    CommonServices,
    {
      provide: 'SupportTicketRepositoryInterface',
      useClass: SupportTicketRepository,
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
      provide: 'CategoryRepositoryInterface',
      useClass: CategoryRepository,
    },
    {
      provide: 'TicketCommentRepositoryInterface',
      useClass: TicketCommentRepository,
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
    TicketData,
  ],
})
export class SupportTicketsModule {}
