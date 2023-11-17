// src/seeder/seeder.service.ts

import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { UserEntity } from 'src/typeOrm/entities/User';
import * as bcrypt from 'bcryptjs';
import { RoleRepositoryInterface } from 'src/Roles/interface/roles.repository.interface';
import { ModuleRepositoryInterface } from 'src/Roles/interface/module.repository.interface';
import { PermissionRepositoryInterface } from 'src/Roles/interface/permission.repository.interface';
import { MerchantRepositoryInterface } from 'src/auth/interface/merchant.interface';
import { UserRepositoryInterface } from 'src/admin/user/interface/user.repository.interface';

@Injectable()
export class SeederService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('RoleRepositoryInterface')
    private readonly roleRepository: RoleRepositoryInterface,
    @Inject('ModuleRepositoryInterface')
    private readonly moduleRepository: ModuleRepositoryInterface,
    @Inject('PermissionRepositoryInterface')
    private readonly permissionRepository: PermissionRepositoryInterface,
    @Inject('MerchantRepositoryInterface')
    private readonly merchantRepository: MerchantRepositoryInterface,
  ) {}

  async seedUsers(): Promise<void> {
    const hasData = await this.userRepository.findAll();
    if (hasData.length < 1) {
      const rolesToSeed = [
        {
          role_name: 'Super Admin',
          status: 1,
          delete_status: 0,
        },
        {
          role_name: 'User',
          status: 1,
          delete_status: 0,
        },
        {
          role_name: 'Sub Admin',
          status: 1,
          delete_status: 0,
        },
        {
          role_name: 'Organizer',
          status: 1,
          delete_status: 0,
        },
        {
          role_name: 'Agent',
          status: 1,
          delete_status: 0,
        },
      ];
      // Add more user data as needed
      for (const roles of rolesToSeed) {
        await this.roleRepository.save(roles);
      }

      const hashedPassword = await bcrypt.hash('Admin@123', 10);

      const usersToSeed = {
        first_name: 'John',
        last_name: 'Doe',
        gender: 1,
        email: 'admin@mail.com',
        phone_number: '1234321234',
        user_role: 1,
        otp_verified: true,
        password: hashedPassword,
      };
      await this.userRepository.save(usersToSeed);
      let merchantToSeed: any;
      merchantToSeed = {
        user_id: 1,
        name: 'Super Admin',
        merchant_key: 'MRCHNT-2023-1',
        secret_key:
          '0bbaaa93b09270402f3f40528594051d635d00752c2398f04e534a238ef2eb07',
      };
      // Create a new date object and set the expiration date to one year from now
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      merchantToSeed.expiry_date = expiryDate;
      await this.merchantRepository.save(merchantToSeed);
      const modulesToSeed = [
        {
          title: 'user',
          status: 1,
          delete_status: 0,
        },
        {
          title: 'booking',
          status: 1,
          delete_status: 0,
        },
        {
          title: 'event',
          status: 1,
          delete_status: 0,
        },

        {
          title: 'merchantkey',
          status: 1,
          delete_status: 0,
        },

        {
          title: 'dashboard',
          status: 1,
          delete_status: 0,
        },

        {
          title: 'permission',
          status: 1,
          delete_status: 0,
        },

        {
          title: 'role',
          status: 1,
          delete_status: 0,
        },

        {
          title: 'questions',
          status: 1,
          delete_status: 0,
        },

        {
          title: 'faq',
          status: 1,
          delete_status: 0,
        },

        {
          title: 'supportticket',
          status: 1,
          delete_status: 0,
        },

        {
          title: 'page',
          status: 1,
          delete_status: 0,
        },

        {
          title: 'notification',
          status: 1,
          delete_status: 0,
        },

        {
          title: 'EventTicket',
          status: 1,
          delete_status: 0,
        },
      ];

      for (const modules of modulesToSeed) {
        await this.moduleRepository.save(modules);
      }
      // Add more user data as needed
      // Add more user data as needed

      const permissionsToSeed = [
        {
          moduleId: 1,
          permissionName: 'read-user',
          status: 1,
          delete_status: 0,
        },
        {
          moduleId: 1,
          permissionName: 'write-user',
          status: 1,
          delete_status: 0,
        },
        {
          moduleId: 1,
          permissionName: 'delete-user',
          status: 1,
          delete_status: 0,
        },
      ];

      for (const permissions of permissionsToSeed) {
        await this.permissionRepository.save(permissions);
      }
    }
  }

  // Add other seed methods for different entities if needed
}
