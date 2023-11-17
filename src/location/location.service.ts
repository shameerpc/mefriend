import { Inject, Injectable, Logger, Req } from '@nestjs/common';
import { ResponsesData } from 'src/common/library/response.data';
import { ILike } from 'typeorm';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { CommonServices } from 'src/common/services/common.service';
import { DeleteLocationDto } from './dto/deleteLocation.dto';
import { CreateLocationDto } from './dto/createLocation.dto';
import { LocationRepositoryInterface } from './interface/location.repository.interface';
import { UpdateLocationDto } from './dto/updateLocation.dto';
import { GetLocationDto } from './dto/getLocation.dto';
import { GetAllLocationDto } from './dto/getAllLocations.dto';
import { LocationResponseData } from './response/location-response';
@Injectable()
export class LocationService {
  constructor(
    @Inject('LocationRepositoryInterface')
    private readonly locationRepository: LocationRepositoryInterface,
    private responses: ResponsesData,
    private commonValidation: CommonValidation,
    private readonly logger: Logger,
    private commonServices: CommonServices,
    private locationResponseData: LocationResponseData,
  ) {}

  async createLocation(
    createLocationDto: CreateLocationDto,
    request,
  ): Promise<any> {
    const { title, status, country_id } = createLocationDto;
    try {
      const isTitleExist = await this.locationRepository.findByCondition({
        title: title,
      });

      if (isTitleExist.length > 0)
        return this.responses.errorResponse('Location already exists');
      const location = {
        title: title,
        country_id: country_id,
        created_by: request.user.user_id,
        status: status,
      };
      const data = await this.locationRepository.save(location);
      console.log(location);
      if (data) {
        return this.responses.successResponse(data);
      }

      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'LocationService.createLocation',
      );
      return this.responses.errorResponse(error);
    }
  }

  async findAllLocation(
    { search, page, limit, status }: GetAllLocationDto,
    request,
  ) {
    try {
      const queryCondition = search ? { title: ILike(`%${search}%`) } : {};
      const offset = page ? page : 1;
      const lmt = limit ? limit : 12;
      const relations: string[] = ['users', 'countries'];

      const data =
        await this.locationRepository.findByConditionWithPaginationAndJoin(
          {
            ...queryCondition,
            status: status ? status : null,
          },
          offset,
          lmt,
          null,
          relations,
        );

      const pagination = {
        offset: offset,
        limit: lmt,
        total: data.total,
      };
      if (data) {
        const result = this.locationResponseData.getAllResponse(
          data.data,
          request.user.role_id,
        );
        const response = {
          result,
          pagination,
        };
        return this.responses.successResponse(response);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'LocationService.findAllLocation',
      );
      throw error;
    }
  }
  async findLocationById({ location_id }: GetLocationDto, request) {
    try {
      const relations: string[] = ['users', 'countries'];

      const queryCondition = location_id ? { id: location_id } : {};
      const data = await this.locationRepository.findOneByIdWithJoin(
        queryCondition,
        relations,
      );
      if (data) {
        const result = this.locationResponseData.getByIdResponse(
          data.data,
          request.user.role_id,
        );
        return this.responses.successResponse(result);
      } else return this.responses.errorResponse('Location not found');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'LocationService.findLocationById',
      );
      throw error;
    }
  }

  async updateLocation(
    UpdateLocationDto: UpdateLocationDto,
    request,
  ): Promise<any> {
    try {
      const { location_id, title, status, country_id } = UpdateLocationDto;
      const isTitleExist = await this.locationRepository.findByCondition({
        title: title,
      });

      if (isTitleExist.length > 0)
        if (isTitleExist[0].id !== location_id)
          return this.responses.errorResponse('Location already exists');
      const location_exist = await this.locationRepository.findByCondition({
        id: location_id,
      });
      if (location_exist.length < 1) {
        return this.responses.errorResponse('Location not found');
      }

      const locationData = {
        title: title,
        country_id: country_id,
        status: status,
        created_by: request.user.user_id,
      };

      const updatedLocation = await this.locationRepository.update(
        location_id,
        locationData,
      );
      if (updatedLocation.affected > 0) {
        return this.responses.successResponse(locationData);
      } else {
        return this.responses.errorResponse('Something went wrong');
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'LocationService.updateLocation',
      );
      throw error;
    }
  }

  async deleteLocation({ location_ids }: DeleteLocationDto) {
    try {
      //first check all categories are valid
      const checkExist = await this.commonServices.checkIdsExist(
        location_ids,
        this.locationRepository,
      );

      if (!checkExist)
        return this.responses.errorResponse(
          'Please ensure that the current statuses of the given location are active.',
        );
      const results = [];
      for (const locationId of location_ids) {
        const isExist = await this.locationRepository.findOneById(locationId);
        if (!isExist)
          results.push({
            id: locationId,
            status: false,
            message: 'Deletion Failed',
          });

        const deleteResult = await this.locationRepository.delete(locationId);
        if (deleteResult) {
          results.push({
            id: locationId,
            status: true,
            message: 'Successfully deleted',
          });
        } else {
          results.push({
            id: locationId,
            status: false,
            message: 'Deletion Failed',
          });
        }
      }
      return results;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'LocationService.deleteLocation',
      );
      throw error;
    }
  }
}
