/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Status } from '../enum/status.enum';
import { use } from 'passport';
import { RolePermissionRepositoryInterface } from 'src/Roles/interface/rolepermission.repository.interface';
import { PermissionRepositoryInterface } from 'src/Roles/interface/permission.repository.interface';
import { ModuleRepositoryInterface } from 'src/Roles/interface/module.repository.interface';
import { join } from 'path';
import { extname } from 'path';
import { createWriteStream } from 'fs';
const otpGenerator = require('otp-generator');
const moment = require('moment-timezone');
import { Multer } from 'multer';
import { CategoryRepositoryInterface } from 'src/category/interface/category.repository.interface';
import { constants } from '../enum/constants.enum';
import { UserOtpRepositoryInterface } from 'src/admin/user/interface/userotp.repository.interface';
import { UserRepositoryInterface } from 'src/admin/user/interface/user.repository.interface';
import { MerchantRepositoryInterface } from 'src/auth/interface/merchant.interface';
import { TicketTypeRepositoryInterface } from 'src/admin/ticket_type/interface/tickettype.repository.interface';
import { EventTicketRepositoryInterface } from 'src/admin/event_ticket/interface/eventticket.repository.interface';
import { RoleRepositoryInterface } from 'src/Roles/interface/roles.repository.interface';
import { EventRepository } from 'src/repositories/event.repository';
import { EventRepositoryInterface } from 'src/admin/event/interface/event.repository.interface';
import { FormRepositoryInterface } from 'src/admin/questionnaire/interface/form.interface.repository';
import { QuestionRepositoryInterface } from 'src/admin/questionnaire/interface/question.iterface.repository';
import * as qrcode from 'qrcode';
import * as AWS from 'aws-sdk';
const crypto = require('crypto');
const s3 = new AWS.S3();

@Injectable()
export class CommonServices {
  constructor(
    @Inject('UserOtpRepositoryInterface')
    private readonly userOtpRepository: UserOtpRepositoryInterface,
    @Inject('UserRepositoryInterface')
    private userRepository: UserRepositoryInterface,
    @Inject('RolePermissionRepositoryInterface')
    private rolePermissionRepository: RolePermissionRepositoryInterface,
    @Inject('PermissionRepositoryInterface')
    private permissionRepository: PermissionRepositoryInterface,
    @Inject('ModuleRepositoryInterface')
    private moduleRepository: ModuleRepositoryInterface,
    private readonly logger: Logger,
    @Inject('CategoryRepositoryInterface')
    private categoryRepository: CategoryRepositoryInterface,
    @Inject('MerchantRepositoryInterface')
    private merchantRepository: MerchantRepositoryInterface,
    @Inject('TicketTypeRepositoryInterface')
    private readonly TicketTypeRepository: TicketTypeRepositoryInterface,
    @Inject('EventTicketRepositoryInterface')
    private readonly eventTicketRepository: EventTicketRepositoryInterface,
    @Inject('RoleRepositoryInterface')
    private readonly roleRepository: RoleRepositoryInterface,
    @Inject('EventRepositoryInterface')
    private readonly eventRepository: EventRepositoryInterface,
    @Inject('FormRepositoryInterface')
    private readonly formRepository: FormRepositoryInterface,
    @Inject('QuestionRepositoryInterface')
    private readonly questionRepository: QuestionRepositoryInterface,
  ) {}
  async generateOtp() {
    try {
      const otp = otpGenerator.generate(4, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      return otp;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'CommonServices.generateOtp',
      );
      throw error;
    }
  }

  async verifyOtpService(user_id: number, otp: string, type: number) {
    try {
      const user = await this.userOtpRepository.findByCondition({
        user_id: user_id,
        otp: otp,
        otp_status: true,
        otp_type: type,
      });
      if (user.length < 1) {
        return false;
      }
      // if (await this.validateOtp(user[0].updated_at)) {
      //   await this.userOtpRepository.findAndUpdate(
      //     { user_id: user_id, otp: otp },
      //     { otp_status: false },
      //   );
      //   return true;
      // }
      return true;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'CommonServices.verifyOtpService',
      );
      throw error;
    }
  }

  private async validateOtp(updatedAt: Date) {
    const updated_at = moment(new Date(updatedAt));
    const m = moment(new Date());
    const seconds = moment.duration(m.diff(updated_at)).asSeconds();
    if (seconds > 120) {
      return false;
    }
    return true;
  }

  async getUserById(user_id: number) {
    const user = await this.userRepository.findOneById(user_id);
    if (user) return user.first_name + ' ' + user.last_name;
    return '';
  }

  async getPermissionsOfAdminRoles(role_id: number) {
    const getPermissions = await this.rolePermissionRepository.findByCondition({
      roleId: role_id,
      hasPermission: true,
      status: Status.Active,
    });
    const permisionResult =
      getPermissions.length > 0
        ? getPermissions.map(async (permission) => {
            const perm_name = await this.permissionRepository.findByCondition({
              id: permission.permissionId,
            });
            const module_name =
              perm_name.length > 0
                ? await this.moduleRepository.findByCondition({
                    id: perm_name[0].moduleId,
                  })
                : [];

            const datam = {
              module: module_name[0].title,
              permission: perm_name[0].permissionName,
            };
            return datam;
          })
        : [];
    const permResult = await Promise.all(permisionResult);
    const groupedData =
      permResult.length > 0
        ? permResult.reduce((acc, item) => {
            const { module, ...rest } = item;
            const otherValues = Object.values(rest).join(', ');
            if (!acc[module]) {
              acc[module] = [otherValues];
            } else {
              acc[module].push(otherValues);
            }
            return acc;
          }, {})
        : [];
    return groupedData;
  }

  // for Save images
  async saveFile(file: Multer.File, destination: string): Promise<string> {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    if (file) {
      const imageFile = file;
      const fileName =
        imageFile.fieldname +
        '-' +
        uniqueSuffix +
        extname(imageFile.originalname);
      const filePath = `./uploads/${destination}/${fileName}`;
      await new Promise<void>((resolve, reject) => {
        const writeStream = createWriteStream(filePath);
        writeStream.write(imageFile.buffer);
        writeStream.end();
        writeStream.on('finish', () => resolve());
        writeStream.on('error', (error) => reject(error));
      });
      return fileName;
    }
    throw new Error('Image file not found in the uploaded data.');
  }
  async checkIdsExist(idArray: number[], repo) {
    let resutAry: number[] = [];
    const checkExist = await Promise.all(
      idArray.map(async (ids: number) => {
        const result = await repo.findByCondition({
          id: ids,
          status: Status.Active,
          delete_status: 0,
        });
        if (result.length < 1) resutAry.push(0);
        else resutAry.push(1);
        return resutAry;
      }),
    );
    // Check if resultAry contains 0
    const containsZero = resutAry.includes(0);
    if (containsZero) {
      return false;
    } else {
      return true;
    }
  }
  async checkIdsExistOrNot(idArray: number[], tableName: string) {
    let resutAry: number[] = [];
    let result = [];
    const checkExist = await Promise.all(
      idArray.map(async (ids: number) => {
        if (tableName === 'roles') {
          result = await this.roleRepository.findByCondition({
            id: ids,
            delete_status: 0,
          });
        } else if (tableName === 'user') {
          result = await this.userRepository.findByCondition({
            id: ids,
            delete_status: 0,
          });
        } else if (tableName === 'permission') {
          result = await this.rolePermissionRepository.findByCondition({
            id: ids,
            delete_status: 0,
          });
        } else {
        }

        if (result.length < 1) resutAry.push(0);
        else resutAry.push(1);

        return resutAry;
      }),
    );
    const containsZero = resutAry.includes(0);
    if (containsZero) {
      return false;
    } else {
      return true;
    }
  }
  async AuthRoleId(user_id: any) {
    const userData = await this.userRepository.findOneById(user_id);
    if (userData) return userData.user_role;
    return null;
  }
  async uniqueMerchantKey(lastId: string) {
    // AMG-Pay-1000-2023
    const prefixString = 'MERCHANT';
    const count = '1000';
    const d = new Date();
    const year = d.getFullYear();
    //let year = new Date('Y');
    const lastTransaction = lastId;
    const lastServiceId = !lastTransaction
      ? `${prefixString}-${count}-${year}`
      : lastTransaction;
    const splitthecount = lastServiceId.split('-');
    const countincrement = parseInt(splitthecount['2']) + 1;
    splitthecount['2'] = countincrement.toString();
    const uniqueId = splitthecount.join('-');
    return uniqueId;
  }
  async getSecretKey() {
    const secretKey = crypto.randomBytes(32).toString('hex');
    const createdAt = new Date(); // Replace this with the actual creation time
    const expiresInDays = constants.MERCHANT_EXPIRY;
    const expirationDate = new Date(createdAt);
    expirationDate.setDate(expirationDate.getDate() + expiresInDays);
    return {
      secretKey: secretKey,
      expiry: expirationDate,
    };
  }
  // async getUsersCountByRole(): Promise<{
  //   [role: number, requested_role: number]: number;
  // }> {
  //   const users = await this.userRepository.findByCondition({
  //     status: Status.Active,
  //     delete_status: 0,
  //   });

  //   const roleCountsMap = users.reduce((acc, user) => {
  //     const { role } = user;
  //     acc[role] = (acc[role] || 0) + 1;
  //     return acc;
  //   }, {});

  //   return roleCountsMap;
  // }
  async getMerchantId(merchantKey: any) {
    const getMerchant = await this.merchantRepository.findByCondition({
      merchant_key: JSON.parse(merchantKey),
    });
    return getMerchant.length > 0 ? getMerchant[0].id : null;
  }
  async getMerchantIdUnAuth(merchantKey: any) {
    const getMerchant = await this.merchantRepository.findByCondition({
      merchant_key: merchantKey,
    });
    return getMerchant.length > 0 ? getMerchant[0].id : null;
  }
  async isCouponValid(from: Date, to: Date): Promise<boolean> {
    const currentDate = new Date();
    const startDate = from;
    const endDate = to;

    return currentDate >= startDate && currentDate <= endDate;
  }
  async getReferalCode() {
    const secretKey = crypto.randomBytes(10).toString('hex');
    return secretKey;
  }

  async saveEventTicketByAnEvent(
    ticket_type_ids: string,
    event_id: number,
    created_by: number,
  ) {
    if (ticket_type_ids) {
      const inputString = ticket_type_ids.toString();
      const arrayFromString = inputString.split(',');
      for (const ticket_type_id of arrayFromString) {
        let eventTicketResult;
        let ticketPrice = await this.TicketTypeRepository.findOneById(
          parseInt(ticket_type_id),
        );
        let price = ticketPrice && ticketPrice.price ? ticketPrice.price : 0;
        let eventTicketData = {
          event_id: event_id,
          ticket_type_id: parseInt(ticket_type_id),
          price: price,
          created_by: created_by,
          status: 1,
        };
        eventTicketResult = await this.eventTicketRepository.save(
          eventTicketData,
        );
      }
      return 1;
    }
  }
  async saveEventTicketByAnEventNoPayment(
    ticket_type_ids: string,
    event_id: number,
    created_by: number,
  ) {
    if (ticket_type_ids) {
      const inputString = ticket_type_ids.toString();
      const arrayFromString = inputString.split(',');
      for (const ticket_type_id of arrayFromString) {
        let eventTicketResult;
        let ticketPrice = await this.TicketTypeRepository.findOneById(
          parseInt(ticket_type_id),
        );
        let price = 0;
        let eventTicketData = {
          event_id: event_id,
          ticket_type_id: parseInt(ticket_type_id),
          price: price,
          created_by: created_by,
          status: 1,
        };
        eventTicketResult = await this.eventTicketRepository.save(
          eventTicketData,
        );
      }
      return 1;
    }
  }
  async getPermissionName(permission_id) {
    const getPer = await this.permissionRepository.findOneById(permission_id);
    return getPer.permissionName;
  }
  async getRoleName(role_id) {
    const getPer = await this.roleRepository.findOneById(role_id);
    return getPer.role_name;
  }
  async getModuleName(module_id) {
    const getPer = await this.moduleRepository.findOneById(module_id);
    return getPer.title;
  }
  async questionAnsweValidationBooking(event_id, questionAnswrAry) {
    const getForm = await this.eventRepository.findOneById(event_id);
    // console.log(getForm);
    const getFormData = await this.questionRepository.findByCondition({
      form_id: getForm.form_id,
      status: Status.Active,
      delete_status: 0,
    });
    if (getFormData.length < 1) return 0;
    // Check if all values in array2 are present in array1
    const allValuesPresent = getFormData.every((item2) =>
      questionAnswrAry.some((item1) => {
        // console.log('item1' + item1.question_id); // Log item1
        // console.log('item2' + item2.id); // Log item1
        // console.log(item1.question_id);

        return item1.question_id === item2.id;
      }),
    );
    // Find values in array1 that are not present in array2
    const valuesNotPresentInArray2 = questionAnswrAry.filter(
      (item1) => !getFormData.some((item2) => item2.id === item1.question_id),
    );
    // console.log(getFormData);
    if (valuesNotPresentInArray2.length > 0) {
      return 2;
    }
    if (!allValuesPresent) {
      return 1;
    }
    return 3;
  }

  async generateSignedUrl(
    bucketName: string,
    objectKey: string,
  ): Promise<string> {
    const config = {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
      region: process.env.AWS_S3_REGION,
    };

    const s3 = new AWS.S3(config);

    // const signedUrlExpireSeconds = 60 * 5; // The URL will expire in 5 minutes
    const signedUrlExpireSeconds = 86400; // The URL will expire in 1 day

    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Expires: signedUrlExpireSeconds,
    };

    return new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', params, (error, url) => {
        if (error) {
          reject(error);
        } else {
          resolve(url);
        }
      });
    });
  }

  // upload and generate qr code url
  async generateQrCode(booking_id: number) {
    try {
      const config = {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_KEY,
        },
        region: process.env.AWS_S3_REGION,
      };

      const s3 = new AWS.S3(config);

      const stringData = JSON.stringify(booking_id);
      const fileName = `booking-event-${booking_id}.png`;
      const qrCodeDataURL = await qrcode.toDataURL(stringData);

      const qrCodeBuffer = Buffer.from(
        qrCodeDataURL.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );

      const bucketName = 'mefriend-qr-code';
      const directoryPath = 'BookingEvent/';
      const s3ObjectKey = directoryPath + fileName;

      // Upload the QR code image to S3
      const s3Params = {
        Bucket: bucketName,
        Key: s3ObjectKey,
        Body: qrCodeBuffer,
        ContentType: 'image/png',
        ACL: 'public-read', // Adjust the ACL as needed
      };

      await s3.upload(s3Params).promise();

      const qrCodeURL = `https://${bucketName}.s3.amazonaws.com/${s3ObjectKey}`;
      return qrCodeURL;
    } catch (error) {
      console.error('Error generating and uploading QR code:', error);
      this.logger.error(
        error.message,
        error.stack,
        'CommonServices.generateQrCode',
      );
      throw error;
    }
  }
  async getTicketType(id: number) {
    let ticketPriceData = await this.TicketTypeRepository.findOneById(id);
    let name =
      ticketPriceData && ticketPriceData.title ? ticketPriceData.title : '';
    return name;
  }
}
