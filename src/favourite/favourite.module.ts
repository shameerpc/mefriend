import { Logger, Module } from '@nestjs/common';
import { FavouriteController } from './favourite.controller';
import { FavouriteService } from './favourite.service';
import { TicketTypeRepository } from 'src/repositories/ticketType.repository';
import { ResponsesData } from 'src/common/library/response.data';
import { CommonServices } from 'src/common/services/common.service';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { EventRepository } from 'src/repositories/event.repository';
import { FavouriteRepository } from './../repositories/favourite.repository';

import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from 'src/typeOrm/entities/Event';
import { FavouriteEntity } from 'src/typeOrm/entities/Favourites';
import { UserRepository } from 'src/repositories/user.repository';
import { UserOtpRepository } from 'src/repositories/userotp.repository';
import { UserEntity } from 'src/typeOrm/entities/User';
import { UserOtpEntity } from 'src/typeOrm/entities/UserOtp';
import { JwtTokenEntity } from 'src/typeOrm/entities/JwtToken';
import { PermissionEntity } from 'src/typeOrm/entities/Permissions';
import { RolePermissionEntity } from 'src/typeOrm/entities/RolePermissions';
import { ModuleEntity } from 'src/typeOrm/entities/Modules';
import { JwtTokenRepository } from 'src/repositories/jwttoken.repository';
import { PermissionRepository } from 'src/repositories/permission.repository';
import { RolePermissionRepository } from 'src/repositories/rolepermission.repository';
import { ModuleRepository } from 'src/repositories/module.repository';
import { CategoryRepository } from 'src/repositories/category.repository';
import { MerchantRepository } from 'src/repositories/merchant.repository';
import { CategoryEntity } from 'src/typeOrm/entities/Category';
import { MerchantEntity } from 'src/typeOrm/entities/Merchants';
import { TicketTypeEntity } from 'src/typeOrm/entities/TicketType';
import { EventTicketRepository } from 'src/repositories/eventticket.repository';
import { EventTicketEntity } from 'src/typeOrm/entities/EventTicket';
import { RoleRepository } from 'src/repositories/role.repository';
import { RolesEntity } from 'src/typeOrm/entities/Roles';
import { FormRepository } from 'src/repositories/form.repository';
import { FormEntity } from 'src/typeOrm/entities/Forms';
import { QuestionEntity } from 'src/typeOrm/entities/Questions';
import { QuestionRepository } from 'src/repositories/question.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity]),
    TypeOrmModule.forFeature([FavouriteEntity]),
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
  ],
  controllers: [FavouriteController],
  providers: [
    FavouriteService,
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
      provide: 'MerchantRepositoryInterface',
      useClass: MerchantRepository,
    },
    {
      provide: 'EventRepositoryInterface',
      useClass: EventRepository,
    },
    {
      provide: 'FavouriteRepositoryInterface',
      useClass: FavouriteRepository,
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
  ],
})
export class FavouriteModule {}
