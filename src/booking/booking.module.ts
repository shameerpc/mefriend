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
import { EventTicketEntity } from 'src/typeOrm/entities/EventTicket';
import { EventTicketRepository } from 'src/repositories/eventticket.repository';
import { CategoryRepository } from 'src/repositories/category.repository';
import { CategoryEntity } from 'src/typeOrm/entities/Category';
import { MerchantRepository } from 'src/repositories/merchant.repository';
import { MerchantEntity } from 'src/typeOrm/entities/Merchants';
import { bookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingRepository } from 'src/repositories/booking.repository';
import { BookingEntity } from 'src/typeOrm/entities/Booking';
import { CouponRepository } from 'src/repositories/coupon.repository';
import { CouponEntity } from 'src/typeOrm/entities/Coupon';
import { BookingCouponRepository } from 'src/repositories/bookingcoupon.repository';
import { BookingCouponEntity } from 'src/typeOrm/entities/BookingCoupon';
import { BookingEventTicketEntity } from 'src/typeOrm/entities/BookingTicketTypes';
import { BookingTicketTypeRepository } from 'src/repositories/bookingtickettype.repository';
import { BookingAdditionalUserRepository } from 'src/repositories/bookingusers.repository';
import { BookingAdditionalUserEntity } from 'src/typeOrm/entities/BookingAdditionalUsers';
import { BookingResponseData } from './response/bookingresponse';
import { TicketTypeRepository } from 'src/repositories/ticketType.repository';
import { TicketTypeEntity } from 'src/typeOrm/entities/TicketType';
import { RoleRepository } from 'src/repositories/role.repository';
import { RolesEntity } from 'src/typeOrm/entities/Roles';
import { BookingQuestionAnswerRepository } from 'src/repositories/bookingquestionanswer.repository';
import { BookingQuestionAnswerEntity } from 'src/typeOrm/entities/BookingQuestionAnswers';
import { EventEntity } from 'src/typeOrm/entities/Event';
import { EventRepository } from 'src/repositories/event.repository';
import { FormRepository } from 'src/repositories/form.repository';
import { FormEntity } from 'src/typeOrm/entities/Forms';
import { QuestionRepository } from 'src/repositories/question.repository';
import { QuestionEntity } from 'src/typeOrm/entities/Questions';
import { QuestionOptionRepository } from 'src/repositories/questionoption.repository';
import { QuestionOptionEntity } from 'src/typeOrm/entities/QuestionOptions';
import { SubEventParticipateRepository } from 'src/repositories/subeventparticipate.repository';
import { SubEventParticipateEntity } from 'src/typeOrm/entities/SubEventParticipate';
import { SubEventQuestionAnswerEntity } from 'src/typeOrm/entities/SubEventQuestionAnswers';
import { SubEventQuestionAnswerRepository } from 'src/repositories/subeventquestionanswer.repository';

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
    TypeOrmModule.forFeature([BookingEntity]),
    TypeOrmModule.forFeature([CouponEntity]),
    TypeOrmModule.forFeature([BookingCouponEntity]),
    TypeOrmModule.forFeature([BookingEventTicketEntity]),
    TypeOrmModule.forFeature([BookingAdditionalUserEntity]),
    TypeOrmModule.forFeature([TicketTypeEntity]),
    TypeOrmModule.forFeature([RolesEntity]),
    TypeOrmModule.forFeature([BookingQuestionAnswerEntity]),
    TypeOrmModule.forFeature([EventEntity]),
    TypeOrmModule.forFeature([FormEntity]),
    TypeOrmModule.forFeature([QuestionEntity]),
    TypeOrmModule.forFeature([QuestionOptionEntity]),
    TypeOrmModule.forFeature([SubEventParticipateEntity]),
    TypeOrmModule.forFeature([SubEventQuestionAnswerEntity]),
  ],

  controllers: [bookingController],
  providers: [
    BookingService,
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
      provide: 'EventTicketRepositoryInterface',
      useClass: EventTicketRepository,
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
      provide: 'BookingRepositoryInterface',
      useClass: BookingRepository,
    },
    {
      provide: 'CouponRepositoryInterface',
      useClass: CouponRepository,
    },
    {
      provide: 'BookingCouponRepositoryInterface',
      useClass: BookingCouponRepository,
    },
    {
      provide: 'BookingTicketTypeRepositoryInterface',
      useClass: BookingTicketTypeRepository,
    },
    {
      provide: 'BookingAdditionalUserRepositoryInterface',
      useClass: BookingAdditionalUserRepository,
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
      provide: 'BookingQuestionAnswerRepositoryInterface',
      useClass: BookingQuestionAnswerRepository,
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
      provide: 'QuestionOptionRepositoryInterface',
      useClass: QuestionOptionRepository,
    },
    {
      provide: 'SubEventParticipateRepositoryInterface',
      useClass: SubEventParticipateRepository,
    },
    {
      provide: 'SubEventQuestionAnswerRepositoryInterface',
      useClass: SubEventQuestionAnswerRepository,
    },

    ResponsesData,
    Logger,
    CommonServices,
    CommonValidation,
    BookingResponseData,
  ],
})
export class BookingModule {}
