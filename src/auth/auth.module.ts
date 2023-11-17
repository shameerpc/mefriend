/* eslint-disable prettier/prettier */
import { Logger, Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from 'src/repositories/user.repository';
import { JwtTokenRepository } from 'src/repositories/jwttoken.repository';
import { UserOtpRepository } from 'src/repositories/userotp.repository';
import { JwtTokenEntity } from 'src/typeOrm/entities/JwtToken';
import { UsersTokenEntity } from 'src/typeOrm/entities/UsersToken';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/typeOrm/entities/User';
import { UserOtpEntity } from 'src/typeOrm/entities/UserOtp';
import { ResponsesData } from 'src/common/library/response.data';
import { CommonServices } from 'src/common/services/common.service';
import { JwtTokenRepositoryInterface } from './interface/jwttoken.interface';
import { RolePermissionRepository } from 'src/repositories/rolepermission.repository';
import { PermissionRepository } from 'src/repositories/permission.repository';
import { ModuleRepository } from 'src/repositories/module.repository';
import { RolePermissionEntity } from 'src/typeOrm/entities/RolePermissions';
import { ModuleEntity } from 'src/typeOrm/entities/Modules';
import { PermissionEntity } from 'src/typeOrm/entities/Permissions';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { MerchantServices } from 'src/common/services/merchant.service';
import { MerchantRepository } from 'src/repositories/merchant.repository';
import { MerchantEntity } from 'src/typeOrm/entities/Merchants';
import { CategoryRepository } from 'src/repositories/category.repository';
import { CategoryEntity } from 'src/typeOrm/entities/Category';
import { UsersModule } from 'src/admin/user/users.module';
import { UserData } from 'src/admin/user/library/user.data';
import { UsersService } from 'src/admin/user/users.service';
import { DashboardResponseData } from 'src/admin/user/response/dashboard.response';
import { BookingRepository } from 'src/repositories/booking.repository';
import { BookingEntity } from 'src/typeOrm/entities/Booking';
import { TicketTypeRepository } from 'src/repositories/ticketType.repository';
import { EventTicketRepository } from 'src/repositories/eventticket.repository';
import { TicketTypeEntity } from 'src/typeOrm/entities/TicketType';
import { EventTicketEntity } from 'src/typeOrm/entities/EventTicket';
import { ReferalPointsRepository } from 'src/repositories/referalpoints.repository';
import { ReferalPointsEntity } from 'src/typeOrm/entities/ReferalPoints';
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
    forwardRef(() => UsersModule) /* to avoid circular dependency */,
    JwtModule.register({
      global: true,
    }),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([UserOtpEntity]),
    TypeOrmModule.forFeature([JwtTokenEntity]),
    TypeOrmModule.forFeature([UsersTokenEntity]),
    TypeOrmModule.forFeature([RolePermissionEntity]),
    TypeOrmModule.forFeature([ModuleEntity]),
    TypeOrmModule.forFeature([PermissionEntity]),
    TypeOrmModule.forFeature([MerchantEntity]),
    TypeOrmModule.forFeature([CategoryEntity]),
    TypeOrmModule.forFeature([BookingEntity]),
    TypeOrmModule.forFeature([TicketTypeEntity]),
    TypeOrmModule.forFeature([EventTicketEntity]),
    TypeOrmModule.forFeature([ReferalPointsEntity]),
    TypeOrmModule.forFeature([RolesEntity]),
    TypeOrmModule.forFeature([EventEntity]),
    TypeOrmModule.forFeature([FormEntity]),
    TypeOrmModule.forFeature([QuestionEntity]),
  ],
  providers: [
    AuthService,
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'JwtTokenRepositoryInterface',
      useClass: JwtTokenRepository,
    },
    {
      provide: 'UserTokenRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'UserOtpRepositoryInterface',
      useClass: UserOtpRepository,
    },

    {
      provide: 'RolePermissionRepositoryInterface',
      useClass: RolePermissionRepository,
    },
    {
      provide: 'PermissionRepositoryInterface',
      useClass: PermissionRepository,
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
      provide: 'ReferalPointRepositoryInterface',
      useClass: ReferalPointsRepository,
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
    UserData,
    UsersService,
    CommonValidation,
    MerchantServices,
    DashboardResponseData,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
