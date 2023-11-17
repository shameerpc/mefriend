import { Inject, Injectable, Logger } from '@nestjs/common';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { ResponsesData } from 'src/common/library/response.data';
import { CommonServices } from 'src/common/services/common.service';
import { PageRepositoryInterface } from './interface/page.repository.interface';
import { CreatePageDto } from './dto/createPage.dto';
import slugify from 'slugify';
import { DeletePageDto } from './dto/deletePage.dto';
import { PageResponseData } from './response/page-response';
import { ILike } from 'typeorm';
import { GetAllPageDto } from './dto/getAllPage.dto';
import { GetPageDto } from './dto/getPage.dto';
import { UpdatePageDto } from './dto/updatePage.dto';

@Injectable()
export class PagesService {
  constructor(
    @Inject('PageRepositoryInterface')
    private readonly pageRepository: PageRepositoryInterface,
    private responses: ResponsesData,
    private commonValidation: CommonValidation,
    private readonly logger: Logger,
    private commonServices: CommonServices,
    private pageResponseData: PageResponseData,
  ) {}

  async createPage(createPageDto: CreatePageDto, request): Promise<any> {
    const { title, description } = createPageDto;
    try {
      const isTitleExist = await this.pageRepository.findByCondition({
        title: title,
      });

      if (isTitleExist.length > 0)
        return this.responses.errorResponse('Page title already exists');

      const slug = slugify(title, {
        lower: true,
        remove: /[*+~.()'"!:@]/g,
        replacement: '-',
      });
      const page = {
        title: title,
        slug: slug,
        description: description,
        status: 1,
        created_by: request.user.user_id,
      };
      const data = await this.pageRepository.save(page);
      if (data) {
        return this.responses.successResponse(data);
      }

      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(error.message, error.stack, 'PagesService.CreatePage');
      return this.responses.errorResponse(error);
    }
  }

  async findAllPage({ search, page, limit }: GetAllPageDto, request) {
    try {
      const queryCondition = search ? { title: ILike(`%${search}%`) } : {};
      const offset = page ? page : 1;
      const lmt = limit ? limit : 12;
      const relations: string[] = ['users'];
      const data =
        await this.pageRepository.findByConditionWithPaginationAndJoin(
          queryCondition,
          offset,
          lmt,
          'id: desc',
          relations,
        );

      const pagination = {
        offset: offset,
        limit: lmt,
        total: data.total,
      };
      if (data) {
        const role_id =
          request.user && request.user.role_id ? request.user.role_id : 2;
        const result = this.pageResponseData.getAllResponse(data.data, role_id);
        const response = {
          result,
          pagination,
        };
        return this.responses.successResponse(response);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(error.message, error.stack, 'PagesService.findAllPage');
      throw error;
    }
  }
  async findPageById({ page_id }: GetPageDto, request) {
    try {
      const relations: string[] = ['users'];

      const queryCondition = page_id ? { id: page_id } : {};
      const data = await this.pageRepository.findOneByIdWithJoin(
        queryCondition,
        relations,
      );
      if (data) {
        const role_id =
          request.user && request.user.role_id ? request.user.role_id : 2;
        const result = this.pageResponseData.getByIdResponse(
          data.data,
          role_id,
        );
        return this.responses.successResponse(result);
      } else return this.responses.errorResponse('Page not found');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'PagesService.findPageById',
      );
      throw error;
    }
  }

  async updatePage(updatePageDto: UpdatePageDto, request): Promise<any> {
    try {
      const { page_id, title, description, status } = updatePageDto;
      const isTitleExist = await this.pageRepository.findByCondition({
        title: title,
      });

      if (isTitleExist.length > 0)
        if (isTitleExist[0].id !== page_id)
          return this.responses.errorResponse('Page title already exists');
      const page_exist = await this.pageRepository.findByCondition({
        id: page_id,
      });
      if (page_exist.length < 1) {
        return this.responses.errorResponse('Page not found');
      }

      const slug = slugify(title, {
        lower: true,
        remove: /[*+~.()'"!:@]/g,
        replacement: '-',
      });

      const pageData = {
        title: title,
        slug: slug,
        description: description,
        status: status,
        created_by: request.user.user_id,
      };

      const updatedPage = await this.pageRepository.update(page_id, pageData);
      if (updatedPage.affected > 0) {
        return this.responses.successResponse(pageData);
      } else {
        return this.responses.errorResponse('Something went wrong');
      }
    } catch (error) {
      this.logger.error(error.message, error.stack, 'PagesService.updatePage');
      throw error;
    }
  }

  async deletePage({ page_ids }: DeletePageDto) {
    try {
      const deletedPageResults = [];
      const checkExist = await this.commonServices.checkIdsExist(
        page_ids,
        this.pageRepository,
      );
      if (!checkExist) return this.responses.errorResponse('Please check page');
      for (const page of page_ids) {
        const isExist = await this.pageRepository.findOneById(page);

        if (!isExist) {
          return this.responses.errorResponse('Page not found');
        }

        const deleteResult = await this.pageRepository.delete(page);
        if (deleteResult) {
          try {
            deletedPageResults.push({
              id: page,
              status: true,
              message: 'Page deleted successfully',
            });
          } catch (error) {
            this.logger.error(
              error.message,
              error.stack,
              'PagesService.deletePage',
            );
            throw error;
          }
        } else {
          deletedPageResults.push({
            id: page,
            status: false,
            message: 'Deletion failed',
          });
        }
      }

      const allDeletedSuccessfully = deletedPageResults.every(
        (result) => result.status,
      );

      if (allDeletedSuccessfully) {
        return this.responses.successResponse({}, 'Page deleted successfully');
      } else {
        return this.responses.errorResponse('Deletion Failed');
      }
    } catch (error) {
      this.logger.error(error.message, error.stack, 'PagesService.deletePage');
      throw error;
    }
  }
}
