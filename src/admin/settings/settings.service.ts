import { Inject, Injectable, Logger } from '@nestjs/common';
import { ResponsesData } from 'src/common/library/response.data';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { Status } from 'src/common/enum/status.enum';
import { SettingsRepositoryInterface } from 'src/homepage/interface/settings.repository.interface';
import { GetSettingDto } from './dto/getSetting.dto';
import { UpdateSettingDto } from './dto/updateSetting.dto';

@Injectable()
export class SettingsService {
  constructor(
    private responses: ResponsesData,
    private readonly logger: Logger,
    private readonly commonValidation: CommonValidation,
    @Inject('SettingsRepositoryInterface')
    private readonly settingsRepository: SettingsRepositoryInterface,
  ) {}

  async findAllSettings({ user_id }: GetSettingDto, request) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      const data = await this.settingsRepository.findByCondition({
        id: 1,
        status: Status.Active,
      });

      if (data) {
        const result = {
          id: data[0].id,
          email: data[0].email,
          country_code: data[0].country_code,
          phone_number: data[0].phone_number,
          single_referral_point: data[0].single_referral_point,
          facebook: data[0].facebook_link,
          instagram: data[0].instagram_link,
          twitter: data[0].twitter_link,
          linkedin: data[0].linkedin_link,
          address: data[0].address,
          description: data[0].description,
        };
        return this.responses.successResponse(result);
      } else return this.responses.errorResponse('Settings not found');
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'SettingsService.findAllSettings',
      );
      throw error;
    }
  }

  async updateSettings(updateDto: UpdateSettingDto) {
    try {
      const {
        user_id,
        email,
        country_code,
        phone_number,
        single_referral_point,
        facebook_link,
        instagram_link,
        twitter_link,
        linkedin_link,
        address,
        description,
      } = updateDto;
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      const data = await this.settingsRepository.findOneById(1);
      if (data) {
        const settingsData = {
          email: email,
          country_code: country_code,
          phone_number: phone_number,
          single_referral_point: single_referral_point,
          facebook_link: facebook_link,
          instagram_link: instagram_link,
          twitter_link: twitter_link,
          linkedin_link: linkedin_link,
          address: address,
          description: description,
        };

        const updatedSettings = await this.settingsRepository.update(
          1,
          settingsData,
        );
        if (updatedSettings.affected > 0) {
          return this.responses.successResponse({});
        } else {
          return this.responses.errorResponse('Something went wrong');
        }
      } else return this.responses.errorResponse('Setting not found');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'SettingsService.updateSettings',
      );
      throw error;
    }
  }
}
