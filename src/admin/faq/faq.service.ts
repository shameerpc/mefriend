import { Inject, Injectable, Logger, Req } from '@nestjs/common';
import { ResponsesData } from 'src/common/library/response.data';
import { ILike } from 'typeorm';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { CommonServices } from 'src/common/services/common.service';
import { DeleteFaqDto } from './dto/deleteFaq.dto';
import { CreateFaqDto } from './dto/createFaq.dto';
import { FaqRepositoryInterface } from './interface/faq.repository.interface';
import { UpdateFaqDto } from './dto/updateFaq.dto';
import { GetFaqDto } from './dto/getFaq.dto';
import { GetAllFaqDto } from './dto/getAllFaqs.dto';
import { FaqResponseData } from './response/faq-response';
@Injectable()
export class FaqService {
  constructor(
    @Inject('FaqRepositoryInterface')
    private readonly faqRepository: FaqRepositoryInterface,
    private responses: ResponsesData,
    private commonValidation: CommonValidation,
    private readonly logger: Logger,
    private commonServices: CommonServices,
    private faqResponseData: FaqResponseData,
  ) {}

  async createFaq(createFaqDto: CreateFaqDto, request): Promise<any> {
    const { question, answer, status } = createFaqDto;
    try {
      const isTitleExist = await this.faqRepository.findByCondition({
        question: question,
      });

      if (isTitleExist.length > 0)
        return this.responses.errorResponse('Faq already exists');
      const faq = {
        question: question,
        answer: answer,
        created_by: request.user.user_id ? request.user.user_id : 0,
        status: status,
      };
      const data = await this.faqRepository.save(faq);
      if (data) {
        return this.responses.successResponse(data);
      }

      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(error.message, error.stack, 'FaqService.createFaq');
      return this.responses.errorResponse(error);
    }
  }

  async findAllFaq({ search, page, limit }: GetAllFaqDto, request) {
    try {
      const queryCondition = search ? { question: ILike(`%${search}%`) } : {};
      const offset = page ? page : 1;
      const lmt = limit ? limit : 12;
      const relations: string[] = ['users'];

      const data =
        await this.faqRepository.findByConditionWithPaginationAndJoin(
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
        const result = this.faqResponseData.getAllResponse(
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
      this.logger.error(error.message, error.stack, 'FaqService.findAllFaq');
      throw error;
    }
  }
  async findFaqById({ faq_id }: GetFaqDto, request) {
    try {
      const relations: string[] = ['users'];

      const queryCondition = faq_id ? { id: faq_id } : {};
      const data = await this.faqRepository.findOneByIdWithJoin(
        queryCondition,
        relations,
      );
      if (data) {
        const result = this.faqResponseData.getByIdResponse(
          data.data,
          request.user.role_id,
        );
        return this.responses.successResponse(result);
      } else return this.responses.errorResponse('Faq not found');
    } catch (error) {
      this.logger.error(error.message, error.stack, 'FaqService.findFaqById');
      throw error;
    }
  }

  async updateFaq(UpdateFaqDto: UpdateFaqDto, request): Promise<any> {
    try {
      const { faq_id, question, status } = UpdateFaqDto;
      const isTitleExist = await this.faqRepository.findByCondition({
        question: question,
      });

      if (isTitleExist.length > 0)
        if (isTitleExist[0].id !== faq_id)
          return this.responses.errorResponse('Faq already exists');
      const faq_exist = await this.faqRepository.findByCondition({
        id: faq_id,
      });
      if (faq_exist.length < 1) {
        return this.responses.errorResponse('Faq not found');
      }

      const faqData = {
        question: question,
        status: status,
        created_by: request.user.user_id,
      };

      const updatedFaq = await this.faqRepository.update(faq_id, faqData);
      if (updatedFaq.affected > 0) {
        return this.responses.successResponse(faqData);
      } else {
        return this.responses.errorResponse('Something went wrong');
      }
    } catch (error) {
      this.logger.error(error.message, error.stack, 'FaqService.updateFaq');
      throw error;
    }
  }

  async deleteFaq({ faq_ids }: DeleteFaqDto) {
    try {
      //first check all categories are valid
      const checkExist = await this.commonServices.checkIdsExist(
        faq_ids,
        this.faqRepository,
      );

      if (!checkExist)
        return this.responses.errorResponse(
          'Please ensure that the current statuses of the given faq are active.',
        );
      const results = [];
      const delresults = [];

      for (const faqId of faq_ids) {
        const isExist = await this.faqRepository.findOneById(faqId);
        if (!isExist)
          results.push({
            id: faqId,
            status: false,
            message: 'Deletion Failed',
          });

        const deleteResult = await this.faqRepository.delete(faqId);
        if (deleteResult) {
          results.push({
            id: faqId,
            status: true,
            message: 'Successfully deleted',
          });
        } else {
          results.push({
            id: faqId,
            status: false,
            message: 'Deletion Failed',
          });
        }
      }
      const allDeletedSuccessfully = delresults.every(
        (result) => result.success,
      );

      if (allDeletedSuccessfully) {
        return this.responses.successResponse({}, 'Faq deleted successfully');
      } else {
        return this.responses.errorResponse('Deletion Failed');
      }
    } catch (error) {
      this.logger.error(error.message, error.stack, 'FaqService.deleteFaq');
      throw error;
    }
  }
}
