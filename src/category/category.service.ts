import { IsNotEmpty } from 'class-validator';
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable, Logger, Req } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ResponsesData } from 'src/common/library/response.data';
import { CategoryRepositoryInterface } from './interface/category.repository.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Multer } from 'multer';
import { GetCategoryDto } from './dto/getCategory.dto';
import { DeleteCategoryDto } from './dto/deleteCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import * as fs from 'fs';
import { ILike } from 'typeorm';
import { GetAllCategoryDto } from './dto/getAllCategory.dto';
import slugify from 'slugify';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { extname, join } from 'path';
import { createWriteStream } from 'fs';
import { CommonServices } from 'src/common/services/common.service';
import { promisify } from 'util';
import { CategoryResponseData } from './response/category-response';
import { EventRepositoryInterface } from 'src/admin/event/interface/event.repository.interface';
@Injectable()
export class CategoryService {
  constructor(
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,
    private responses: ResponsesData,
    private commonValidation: CommonValidation,
    private readonly logger: Logger,
    private commonServices: CommonServices,
    private categoryResponseData: CategoryResponseData,
    @Inject('EventRepositoryInterface')
    private readonly eventRepository: EventRepositoryInterface,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
    request,
  ): Promise<any> {
    const { title, sub_title, description, image, status } = createCategoryDto;
    try {
      const slug = slugify(title, {
        lower: true,
        remove: /[*+~.()'"!:@]/g,
        replacement: '-',
      });

      const slug_value = await this.categoryRepository.findByCondition({
        slug: slug,
      });
      if (slug_value.length > 0) {
        return this.responses.errorResponse(
          'Category with the same slug already exists.Please enter a valid title',
        );
      }

      const category = {
        title: title,
        sub_title: sub_title,
        description: description,
        // category_type: category_type,
        image: image,
        slug: '',
        status: status,
        sort_order: null,
        created_by: request.user.user_id,
      };

      category.slug = slug;
      let highestIdCategory = null;

      const totalCategoryList = await this.categoryRepository.findAll();
      if (totalCategoryList.length > 0) {
        for (const category of totalCategoryList) {
          if (!highestIdCategory || category.id > highestIdCategory.id) {
            highestIdCategory = category;
          }
        }
      }
      if (highestIdCategory) {
        category.sort_order = highestIdCategory.id + 1;
      } else {
        category.sort_order = 1;
      }
      category.slug = slug;
      console.log(category);
      const data = await this.categoryRepository.save(category);
      if (data) {
        return this.responses.successResponse(data);
      }

      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'CategoryService.createCategory',
      );
      return this.responses.errorResponse(error);
    }
  }

  async findAllCategory({ search, page, limit }: GetAllCategoryDto, request) {
    try {
      const queryCondition = search ? { title: ILike(`%${search}%`) } : {};
      const offset = page ? page : 1;
      const lmt = limit ? limit : 12;
      const relations: string[] = ['users'];

      const data =
        await this.categoryRepository.findByConditionWithPaginationAndJoin(
          queryCondition,
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
        const result = this.categoryResponseData.getAllResponse(
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
        'CategoryService.findAllCategory',
      );
      throw error;
    }
  }
  async findCategoryById({ category_id }: GetCategoryDto, request) {
    try {
      const queryCondition = category_id ? { id: category_id } : {};
      const relations: string[] = ['users'];

      const data = await this.categoryRepository.findOneByIdWithJoin(
        queryCondition,
        relations,
      );

      if (data) {
        const result = this.categoryResponseData.getByIdResponse(
          data.data,
          request.user.role_id,
        );

        return this.responses.successResponse(result);
      } else return this.responses.errorResponse('Category not found');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'CategoryService.findCategoryById',
      );
      throw error;
    }
  }

  async updateCategory(updateDto: UpdateCategoryDto, request): Promise<any> {
    try {
      let requestSortValue = null;
      const {
        category_id,
        title,
        sub_title,
        description,

        image,
        status,
        sort_order,
      } = updateDto;

      const category_exist = await this.categoryRepository.findByCondition({
        id: category_id,
      });
      if (category_exist.length < 1) {
        return this.responses.errorResponse('Category not found');
      }

      if (sort_order) {
        if (Number.isInteger(Number(sort_order))) {
          requestSortValue = sort_order;
          const categories = await this.categoryRepository.findAll({
            order: {
              sort_order: 'ASC',
            },
          });
          let currentSortOrder = 1;
          for (const category of categories) {
            if (category.id === category_id) {
              category.sort_order = sort_order;
            } else if (category.sort_order >= sort_order) {
              category.sort_order++;
            } else {
              category.sort_order = currentSortOrder;
            }
            await this.categoryRepository.save(category);
            currentSortOrder++;
          }
        } else {
          return this.responses.errorResponse('Sort order must be an integer');
        }
      }

      const categoryData = {
        title: title,
        sub_title: sub_title,
        description: description,
        // category_type: category_type,
        image: image,
        sort_order: sort_order
          ? requestSortValue
          : category_exist[0].sort_order,
        status: status,
        created_by: request.user.user_id,
      };

      const updatedCategory = await this.categoryRepository.update(
        category_id,
        categoryData,
      );
      if (updatedCategory.affected > 0) {
        return this.responses.successResponse(categoryData);
      } else {
        return this.responses.errorResponse('Something went wrong');
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'CategoryService.updateCategory',
      );
      throw error;
    }
  }

  async deleteCategory({ category_ids }: DeleteCategoryDto) {
    try {
      //first check all categories are valid
      const checkExist = await this.commonServices.checkIdsExist(
        category_ids,
        this.categoryRepository,
      );
      if (!checkExist)
        return this.responses.errorResponse(
          'please ensure that the current statuses of the given categories are active.',
        );
      const results = [];
      for (const categoryId of category_ids) {
        //Check if the organizer id exist or not
        const isCategoryExistEvent = await this.eventRepository.findByCondition(
          {
            category_id: categoryId,
          },
        );
        if (isCategoryExistEvent.length > 0)
          return this.responses.errorResponse(
            'You can not delete this category,because this category associated in some event',
          );
        const isExist = await this.categoryRepository.findOneById(categoryId);

        // if (!isExist) {
        //   results.push({
        //     id: categoryId,
        //     success: false,
        //     message: 'Category not found',
        //   });
        //   continue;
        // }

        const deleteResult = await this.categoryRepository.delete(categoryId);
        if (deleteResult) {
          results.push({
            id: categoryId,
            status: true,
            message: 'Category deleted successfully',
          });
        } else {
          results.push({
            id: categoryId,
            status: false,
            message: 'Deletion failed',
          });
        }
      }
      const allDeletedSuccessfully = results.every((result) => result.status);

      if (allDeletedSuccessfully) {
        return this.responses.successResponse(
          {},
          'Categories deleted successfully',
        );
      } else {
        return this.responses.errorResponse('Deletion Failed');
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'CategoryService.deleteCategory',
      );
      throw error;
    }
  }
}
