import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './typeOrm/entities/User';
import { RolesEntity } from './typeOrm/entities/Roles';
import { UserOtpEntity } from './typeOrm/entities/UserOtp';
import { PermissionEntity } from './typeOrm/entities/Permissions';
import { ModuleEntity } from './typeOrm/entities/Modules';
import { JwtTokenEntity } from './typeOrm/entities/JwtToken';
import { UsersTokenEntity } from './typeOrm/entities/UsersToken';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './Roles/role.module';
import { SeederService } from './seeder/seeder.service';
import { UserRepository } from './repositories/user.repository';
import { RoleRepository } from './repositories/role.repository';
import { ModuleRepository } from './repositories/module.repository';
import { PermissionRepository } from './repositories/permission.repository';
import { CategoryModule } from './category/category.module';
import { CategoryEntity } from './typeOrm/entities/Category';
import { CategoryTypeEntity } from './typeOrm/entities/CategoryType';
import { EventSeasonEntity } from './typeOrm/entities/EventSeason';
import { LocationEntity } from './typeOrm/entities/Location';
import { LocationModule } from './location/location.module';
import { CouponEntity } from './typeOrm/entities/Coupon';
import { CouponModule } from './admin/coupon/coupon.module';
import { SupportTicketsModule } from './support-tickets/support-tickets.module';
import { SupportTicketsEntity } from './typeOrm/entities/SupportTickets';
import { TicketCommentsEntity } from './typeOrm/entities/TicketComments';
import { EventModule } from './admin/event/event.module';
import { TicketTypeModule } from './admin/ticket_type/tickettype.module';
import { EventEntity } from './typeOrm/entities/Event';
import { TicketTypeEntity } from './typeOrm/entities/TicketType';
import { EventTicketModule } from './admin/event_ticket/eventticket.module';

import { MerchantServices } from './common/services/merchant.service';
import { MerchantEntity } from './typeOrm/entities/Merchants';
import { MerchantRepository } from './repositories/merchant.repository';
import { MerchantModule } from './merchant/merchant.module';
import { configure } from 'winston';
import { MerchantAuthMiddleware } from './auth/middleware/merchant-auth.middleware';
import { UsersModule } from './admin/user/users.module';
import { UserModule } from './user/users.module';
import { HomepageModule } from './homepage/homepage.module';
import { SettingsEntity } from './typeOrm/entities/Settings';
import { BookingModule } from './booking/booking.module';
import { QuestionnaireModule } from './admin/questionnaire/questionnaire.module';
import { FavouriteModule } from './favourite/favourite.module';
import { FavouriteEntity } from './typeOrm/entities/Favourites';

import { NotificationEntity } from './typeOrm/entities/Notitfication';
import { NotificationModule } from './notification/notification.module';
import { FaqModule } from './admin/faq/faq.module';
import { FaqRepository } from './repositories/faq.repository';
import { FaqEntity } from './typeOrm/entities/Faq';
import { PageEntity } from './typeOrm/entities/Page';
import { PagesModule } from './admin/pages/pages.module';
import { SubEventEntity } from './typeOrm/entities/SubEvent';
import { SettingsModule } from './admin/settings/settings.module';
import { SubEventParticipateEntity } from './typeOrm/entities/SubEventParticipate';
import { SubEventModule } from './admin/sub_event/sub_event.module';
import { MailModule } from './mail/mail.module';
import { CountryEntity } from './typeOrm/entities/Country';
@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER ? process.env.POSTGRES_USER : '',
      password: process.env.POSTGRES_PASSWORD
        ? process.env.POSTGRES_PASSWORD
        : '',
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      // schema: 'public',
      entities: [
        UserEntity,
        RolesEntity,
        UserOtpEntity,
        PermissionEntity,
        ModuleEntity,
        JwtTokenEntity,
        UsersTokenEntity,
        MerchantEntity,
        CategoryEntity,
        // CategoryTypeEntity,
        EventSeasonEntity,
        LocationEntity,
        CouponEntity,
        SupportTicketsEntity,
        TicketCommentsEntity,
        EventEntity,
        TicketTypeEntity,
        SettingsEntity,
        FavouriteEntity,
        NotificationEntity,
        FaqEntity,
        PageEntity,
        SubEventEntity,
        SubEventParticipateEntity,
        CountryEntity,
      ],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    MerchantModule,
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([RolesEntity]),
    TypeOrmModule.forFeature([ModuleEntity]),
    TypeOrmModule.forFeature([PermissionEntity]),
    TypeOrmModule.forFeature([MerchantEntity]),
    TypeOrmModule.forFeature([FaqEntity]),
    CategoryModule,
    LocationModule,
    CouponModule,
    SupportTicketsModule,
    EventModule,
    TicketTypeModule,
    EventTicketModule,
    UserModule,
    HomepageModule,
    BookingModule,
    QuestionnaireModule,
    FavouriteModule,
    NotificationModule,
    FaqModule,
    PagesModule,
    SettingsModule,
    SubEventModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SeederService,
    MerchantServices,
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
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
      provide: 'PermissionRepositoryInterface',
      useClass: PermissionRepository,
    },
    {
      provide: 'MerchantRepositoryInterface',
      useClass: MerchantRepository,
    },
    {
      provide: 'FaqRepositoryInterface',
      useClass: FaqRepository,
    },
  ],
})
export class AppModule {
  constructor(private readonly seederService: SeederService) {}
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(MerchantAuthMiddleware).forRoutes('*');
    consumer
      .apply(MerchantAuthMiddleware)
      .forRoutes(
        'auth/register',
        'auth/verify-otp',
        'auth/resend-otp',
        'auth/sign-in-with-otp',
        'auth/login',
        'auth/google-login',
        'auth/merge-account',
        'auth/refresh',
        'auth/forgot-password',
        'auth/update-password',
      );
  }
  async onModuleInit() {
    // Call the seedUsers() method here to seed the database
    await this.seederService.seedUsers();
  }
}
