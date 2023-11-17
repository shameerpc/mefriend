import { Logger, Module } from '@nestjs/common';
import { HomepageController } from './homepage.controller';
import { HomepageService } from './homepage.service';
import { ResponsesData } from 'src/common/library/response.data';
import { CommonServices } from 'src/common/services/common.service';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { UserOtpRepository } from 'src/repositories/userotp.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/typeOrm/entities/User';
import { UserOtpEntity } from 'src/typeOrm/entities/UserOtp';
import { JwtTokenEntity } from 'src/typeOrm/entities/JwtToken';
import { PermissionEntity } from 'src/typeOrm/entities/Permissions';
import { RolePermissionEntity } from 'src/typeOrm/entities/RolePermissions';
import { ModuleEntity } from 'src/typeOrm/entities/Modules';
import { CategoryEntity } from 'src/typeOrm/entities/Category';
import { UserRepository } from 'src/repositories/user.repository';
import { JwtTokenRepository } from 'src/repositories/jwttoken.repository';
import { PermissionRepository } from 'src/repositories/permission.repository';
import { RolePermissionRepository } from 'src/repositories/rolepermission.repository';
import { ModuleRepository } from 'src/repositories/module.repository';
import { CategoryRepository } from 'src/repositories/category.repository';
import { EventEntity } from 'src/typeOrm/entities/Event';
import { EventRepository } from 'src/repositories/event.repository';
import { EventTicketEntity } from 'src/typeOrm/entities/EventTicket';
import { EventTicketRepository } from 'src/repositories/eventticket.repository';
import { SettingsRepository } from 'src/repositories/settings.repository';
import { SettingsEntity } from 'src/typeOrm/entities/Settings';
import { MerchantRepository } from 'src/repositories/merchant.repository';
import { MerchantEntity } from 'src/typeOrm/entities/Merchants';
import { TicketTypeEntity } from 'src/typeOrm/entities/TicketType';
import { TicketTypeRepository } from 'src/repositories/ticketType.repository';
import { RolesEntity } from 'src/typeOrm/entities/Roles';
import { RoleRepository } from 'src/repositories/role.repository';
import { FaqRepository } from 'src/repositories/faq.repository';
import { FaqEntity } from 'src/typeOrm/entities/Faq';
import { FaqResponseData } from 'src/admin/faq/response/faq-response';
import { FormRepository } from 'src/repositories/form.repository';
import { FormEntity } from 'src/typeOrm/entities/Forms';
import { QuestionRepository } from 'src/repositories/question.repository';
import { QuestionEntity } from 'src/typeOrm/entities/Questions';
import { CountryEntity } from 'src/typeOrm/entities/Country';
import { CountryRepository } from 'src/repositories/country.repository';
import { FavouriteRepository } from 'src/repositories/favourite.repository';
import { FavouriteEntity } from 'src/typeOrm/entities/Favourites';

@Module({
  imports: [
    TypeOrmModule.forFeature([SettingsEntity]),
    TypeOrmModule.forFeature([EventTicketEntity]),
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
    TypeOrmModule.forFeature([RolesEntity]),
    TypeOrmModule.forFeature([FaqEntity]),
    TypeOrmModule.forFeature([FormEntity]),
    TypeOrmModule.forFeature([QuestionEntity]),
    TypeOrmModule.forFeature([CountryEntity]),
    TypeOrmModule.forFeature([FavouriteEntity]),
  ],
  controllers: [HomepageController],
  providers: [
    HomepageService,
    {
      provide: 'SettingsRepositoryInterface',
      useClass: SettingsRepository,
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
      provide: 'TicketTypeRepositoryInterface',
      useClass: TicketTypeRepository,
    },
    {
      provide: 'RoleRepositoryInterface',
      useClass: RoleRepository,
    },
    {
      provide: 'FaqRepositoryInterface',
      useClass: FaqRepository,
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
      provide: 'CountryRepositoryInterface',
      useClass: CountryRepository,
    },
    {
      provide: 'FavouriteRepositoryInterface',
      useClass: FavouriteRepository,
    },
    ResponsesData,
    Logger,
    CommonServices,
    CommonValidation,
    FaqResponseData,
  ],
})
export class HomepageModule {}
