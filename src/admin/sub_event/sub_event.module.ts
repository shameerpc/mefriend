/* eslint-disable prettier/prettier */
import { Logger, Module } from '@nestjs/common';
import { ResponsesData } from 'src/common/library/response.data';
import { CommonServices } from 'src/common/services/common.service';
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
import { EventEntity } from 'src/typeOrm/entities/Event';
import { EventRepository } from 'src/repositories/event.repository';
import { CategoryRepository } from 'src/repositories/category.repository';
import { CategoryEntity } from 'src/typeOrm/entities/Category';
import { MerchantRepository } from 'src/repositories/merchant.repository';
import { MerchantEntity } from 'src/typeOrm/entities/Merchants';
import { TicketTypeRepository } from 'src/repositories/ticketType.repository';
import { EventTicketRepository } from 'src/repositories/eventticket.repository';
import { EventTicketEntity } from 'src/typeOrm/entities/EventTicket';
import { TicketTypeEntity } from 'src/typeOrm/entities/TicketType';
import { RolesEntity } from 'src/typeOrm/entities/Roles';
import { RoleRepository } from 'src/repositories/role.repository';
import { FormRepository } from 'src/repositories/form.repository';
import { FormEntity } from 'src/typeOrm/entities/Forms';
import { QuestionEntity } from 'src/typeOrm/entities/Questions';
import { QuestionRepository } from 'src/repositories/question.repository';
import { EventSponsorRepository } from 'src/repositories/eventSponsors.repository';
import { EventSponsorEntity } from 'src/typeOrm/entities/EventSponsor';
import { SubEventController } from './sub_event.controller';
import { SubEventService } from './sub_event.service';
import { SubEventParticipateRepository } from 'src/repositories/subeventparticipate.repository';
import { SubEventParticipateEntity } from 'src/typeOrm/entities/SubEventParticipate';
import { SubEventQuestionAnswerRepository } from 'src/repositories/subeventquestionanswer.repository';
import { SubEventQuestionAnswerEntity } from 'src/typeOrm/entities/SubEventQuestionAnswers';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity]),
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
    TypeOrmModule.forFeature([FormEntity]),
    TypeOrmModule.forFeature([QuestionEntity]),
    TypeOrmModule.forFeature([EventSponsorEntity]),
    TypeOrmModule.forFeature([SubEventParticipateEntity]),
    TypeOrmModule.forFeature([SubEventQuestionAnswerEntity]),
  ],

  controllers: [SubEventController],
  providers: [
    SubEventService,
    CommonServices,
    {
      provide: 'SubEventParticipateRepositoryInterface',
      useClass: SubEventParticipateRepository,
    },
    {
      provide: 'eventRepositoryInterface',
      useClass: EventRepository,
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
      provide: 'EventRepositoryInterface',
      useClass: EventRepository,
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
      provide: 'EventSponsorRepositoryInterface',
      useClass: EventSponsorRepository,
    },
    {
      provide: 'RoleRepositoryInterface',
      useClass: RoleRepository,
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
      provide: 'SubEventQuestionAnswerRepositoryInterface',
      useClass: SubEventQuestionAnswerRepository,
    },
    ResponsesData,
    Logger,
    CommonServices,
    CommonValidation,
  ],
})
export class SubEventModule {}
