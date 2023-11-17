/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logger, Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from 'src/typeOrm/entities/User';
import { UserRepository } from 'src/repositories/user.repository';
import { ResponsesData } from 'src/common/library/response.data';
import { CommonServices } from 'src/common/services/common.service';
import { UserOtpEntity } from 'src/typeOrm/entities/UserOtp';
import { UserData } from './library/user.data';
import { UserOtpRepository } from 'src/repositories/userotp.repository';
import { AuthModule } from 'src/auth/auth.module';
import { PermissionRepository } from 'src/repositories/permission.repository';
import { PermissionEntity } from 'src/typeOrm/entities/Permissions';
import { JwtTokenRepository } from 'src/repositories/jwttoken.repository';
import { JwtTokenEntity } from 'src/typeOrm/entities/JwtToken';
import { RolePermissionRepository } from 'src/repositories/rolepermission.repository';
import { RolePermissionEntity } from 'src/typeOrm/entities/RolePermissions';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { RoleRepository } from 'src/repositories/role.repository';
import { RolesEntity } from 'src/typeOrm/entities/Roles';
import { ModuleRepository } from 'src/repositories/module.repository';
import { ModuleEntity } from 'src/typeOrm/entities/Modules';
import { MerchantRepository } from 'src/repositories/merchant.repository';
import { MerchantEntity } from 'src/typeOrm/entities/Merchants';
import { CategoryRepository } from 'src/repositories/category.repository';
import { CategoryEntity } from 'src/typeOrm/entities/Category';
import { DashboardResponseData } from './response/dashboard.response';
import { BookingEntity } from 'src/typeOrm/entities/Booking';
import { BookingRepository } from 'src/repositories/booking.repository';
import { TicketTypeRepository } from 'src/repositories/ticketType.repository';
import { EventTicketRepository } from 'src/repositories/eventticket.repository';
import { EventTicketEntity } from 'src/typeOrm/entities/EventTicket';
import { TicketTypeEntity } from 'src/typeOrm/entities/TicketType';
import { EventRepository } from 'src/repositories/event.repository';
import { EventEntity } from 'src/typeOrm/entities/Event';
import { FormRepository } from 'src/repositories/form.repository';
import { FormEntity } from 'src/typeOrm/entities/Forms';
import { QuestionRepository } from 'src/repositories/question.repository';
import { QuestionEntity } from 'src/typeOrm/entities/Questions';

@Module({
  controllers: [UsersController],

  imports: [
    forwardRef(() => AuthModule) /* to avoid circular dependency */,
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([UserOtpEntity]),
    TypeOrmModule.forFeature([PermissionEntity]),
    TypeOrmModule.forFeature([JwtTokenEntity]),
    TypeOrmModule.forFeature([RolePermissionEntity]),
    TypeOrmModule.forFeature([RolesEntity]),
    TypeOrmModule.forFeature([ModuleEntity]),
    TypeOrmModule.forFeature([MerchantEntity]),
    TypeOrmModule.forFeature([CategoryEntity]),
    TypeOrmModule.forFeature([BookingEntity]),
    TypeOrmModule.forFeature([TicketTypeEntity]),
    TypeOrmModule.forFeature([EventTicketEntity]),
    TypeOrmModule.forFeature([EventEntity]),
    TypeOrmModule.forFeature([FormEntity]),
    TypeOrmModule.forFeature([QuestionEntity]),
  ],
  providers: [
    UsersService,
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'UserOtpRepositoryInterface',
      useClass: UserOtpRepository,
    },
    {
      provide: 'PermissionRepositoryInterface',
      useClass: PermissionRepository,
    },

    {
      provide: 'JwtTokenRepositoryInterface',
      useClass: JwtTokenRepository,
    },
    {
      provide: 'JwtTokenRepositoryInterface',
      useClass: JwtTokenRepository,
    },
    {
      provide: 'RolePermissionRepositoryInterface',
      useClass: RolePermissionRepository,
    },

    {
      provide: 'RoleRepositoryInterface',
      useClass: RoleRepository,
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
      provide: 'CategoryRepositoryInterface',
      useClass: CategoryRepository,
    },
    {
      provide: 'BookingRepositoryInterface',
      useClass: BookingRepository,
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
    UserData,
    CommonValidation,
    DashboardResponseData,
  ],
})
export class UsersModule {}
