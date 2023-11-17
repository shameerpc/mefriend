import { IsNotEmpty } from 'class-validator';
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable, Logger, Req } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ResponsesData } from 'src/common/library/response.data';

import { Multer } from 'multer';
import * as fs from 'fs';
import { ILike } from 'typeorm';
import slugify from 'slugify';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { extname, join } from 'path';
import { createWriteStream } from 'fs';
import { CommonServices } from 'src/common/services/common.service';
import { promisify } from 'util';
import { QuestionRepositoryInterface } from './interface/question.iterface.repository';
import { CreateQuestionsDto } from './dto/addquestionnaire.dto';
import { QuestionTypeRepositoryInterface } from './interface/questiontype.interface.rpository';
import { QuestionOptionRepositoryInterface } from './interface/questionoption.interface.repository';
import { title } from 'process';
import { GetQuestionsDto } from './dto/getquestionnaire.dto';
import { Status } from 'src/common/enum/status.enum';
import { QuestionResponseData } from './response/questionresponse';
import { FormRepositoryInterface } from './interface/form.interface.repository';
import { GetQuestionsByIdDto } from './dto/getquestionsbyid.dto';
import { UpdateQuestionsDto } from './dto/updatequestion.dto';
import { DeleteQuestionsByIdDto } from './dto/deletequestion.dto';

@Injectable()
export class QuestionService {
  constructor(
    @Inject('QuestionRepositoryInterface')
    private readonly questionRepository: QuestionRepositoryInterface,
    private responses: ResponsesData,
    private commonValidation: CommonValidation,
    private readonly logger: Logger,
    private commonServices: CommonServices,
    @Inject('QuestionTypeRepositoryInterface')
    private readonly questiontypeRepository: QuestionTypeRepositoryInterface,
    @Inject('QuestionOptionRepositoryInterface')
    private readonly questionoptionRepository: QuestionOptionRepositoryInterface,
    private questionResponseData: QuestionResponseData,
    @Inject('FormRepositoryInterface')
    private readonly formRepository: FormRepositoryInterface,
  ) {}

  async createQuestion(
    createQuestionsDto: CreateQuestionsDto,
    request,
  ): Promise<any> {
    const { questions, event_type } = createQuestionsDto;
    try {
      if (questions.length < 1)
        return this.responses.errorResponse('Questions should not be empty');
      let resutAry: any[] = [];
      const checkExist = await Promise.all(
        questions.map(async (qstn: any) => {
          const checkQuestionExist =
            await this.questionRepository.findByCondition({
              title: qstn.title,
              delete_status: 0,
            });
          //console.log(checkQuestionExist);
          if (checkQuestionExist.length > 0)
            resutAry.push(checkQuestionExist[0].title);
          else resutAry.push(1);

          return resutAry;
        }),
      );
      const allOnes = resutAry.every((value) => value === 1);
      if (!allOnes) {
        return this.responses.errorResponse(
          allOnes + ' please check the questions these are alreay added',
        );
      }
      const getFormId = await this.getFormId();
      console.log(getFormId);

      const saveForm = await this.formRepository.save({
        title: getFormId,
        created_by: request.user.user_id,
      });
      const metchantId = await this.commonServices.getMerchantId(
        request.user.merchant,
      );
      const checkQuestionsSame = this.hasDuplicateTitles(questions); //in incoming array
      if (checkQuestionsSame)
        return this.responses.errorResponse('Questions should be different');

      //save questions
      const saveData = await Promise.all(
        questions.map(async (qstn: any) => {
          const saveQstns = await this.questionRepository.save({
            question_type: qstn.question_type,
            title: qstn.title,
            form_id: saveForm.id,
            created_by: request.user.user_id,
            merchant_id: metchantId,
            event_type: event_type,
            // event_type_id: event_type_id,
          });
          if (qstn.question_type != 1) {
            qstn.options.map(async (option: any) => {
              const saveQstnsOptions = await this.questionoptionRepository.save(
                {
                  question_id: saveQstns.id,
                  option: option,
                  created_by: request.user.user_id,
                },
              );
            });
          }
        }),
      );
      if (saveData) return this.responses.successResponse(saveData);

      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'CouponService.createCoupon',
      );
      return this.responses.errorResponse(error);
    }
  }
  async getQuestions(
    {
      user_id,
      form_id,
      question_id,
      page,
      limit,
      search,
      status,
    }: GetQuestionsDto,
    request,
  ) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      const queryCondition: any = search ? { title: ILike(`%${search}%`) } : {};
      const offset = page ? page : 1;
      const lmt = limit ? limit : 12;
      if (form_id) {
        queryCondition.form_id = form_id;
      }
      if (question_id) {
        queryCondition.question_id = question_id;
      }
      if (status) {
        queryCondition.status = status;
      }
      queryCondition.status = Status.Active;
      queryCondition.delete_status = 0;

      const joinTables = ['users', 'questiontype', 'questionoptions', 'form'];
      console.log(queryCondition);
      const data =
        await this.questionRepository.findWithDynamicJoinsAndPagination(
          queryCondition,
          offset,
          lmt,
          joinTables,
        );
      console.log(data);

      const pagination = {
        offset: offset,
        limit: lmt,
        total: data.total,
      };
      if (data) {
        const result = await Promise.all(
          data.data.map(async (datam) => {
            return {
              form_id: datam.form_id,
              title: datam.title,
              question_id: datam.id,
              question: datam.title,
              event_type: datam.event_type === 1 ? 'Event' : 'Sub Event',
              // event_type_id: datam.event_type_id ? datam.event_type_id : '',
              question_type: datam.question_type,
              created_at: datam.created_at,
              options: datam.questionoptions,
            };
          }),
        );
        const response = {
          result,
          pagination,
        };
        return this.responses.successResponse(response);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(error.message, error.stack, 'RoleService.deleteRole');
      throw error;
    }
  }
  async getQuestionsById(
    { user_id, question_id }: GetQuestionsByIdDto,
    request,
  ) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      const checkExist = await this.questionRepository.findOneById(question_id);
      if (!checkExist)
        return this.responses.errorResponse('Question not found');
      const joinTables = ['users', 'questiontype', 'questionoptions', 'form'];

      const getData = await this.questionRepository.findOneWithDynamicJoins(
        question_id,
        joinTables,
        { status: Status.Active },
      );
      const result = {
        id: getData.id,
        question: getData.title,
        Option: getData.questionoptions,
        form_id: getData.form.id,
        question_type: getData.question_type,
        event_type: getData.event_type,
        // event_type_id: getData.event_type_id ? getData.event_type_id : '',
        status: getData.status,
        created_by: getData.users.first_name + ' ' + getData.users.last_name,
      };
      if (getData) return this.responses.successResponse(result);
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(error.message, error.stack, 'RoleService.deleteRole');
      throw error;
    }
  }
  async updateQuestion(
    {
      user_id,
      form_id,
      questions,
      event_type,
    }: // event_type_id,
    UpdateQuestionsDto,
    request,
  ) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      const checkExist = await this.questionRepository.findByCondition({
        form_id: form_id,
      });
      if (checkExist.length === 0)
        return this.responses.errorResponse('Form not found');
      //-----deleting questionnaire start---------
      const deleteQuestion = await this.questionRepository.findAndUpdate(
        { form_id: form_id },
        { status: Status.Inactive, delete_status: 1, deleted_at: new Date() },
      );

      await Promise.all(
        checkExist.map(async (qstn: any) => {
          if (deleteQuestion) {
            await this.questionoptionRepository.findAndUpdate(
              { question_id: qstn.id },
              {
                status: Status.Inactive,
                delete_status: 1,
                deleted_at: new Date(),
              },
            );
          } else {
            return this.responses.errorResponse('Something went wrong');
          }
        }),
      );
      //------------------end---------------

      //---------Creating new ---------
      try {
        if (questions.length < 1)
          return this.responses.errorResponse('Questions should not be empty');
        let resutAry: any[] = [];
        const checkExist = await Promise.all(
          questions.map(async (qstn: any) => {
            const checkQuestionExist =
              await this.questionRepository.findByCondition({
                title: qstn.title,
                delete_status: 0,
              });
            //console.log(checkQuestionExist);
            if (checkQuestionExist.length > 0)
              resutAry.push(checkQuestionExist[0].title);
            else resutAry.push(1);

            return resutAry;
          }),
        );
        const allOnes = resutAry.every((value) => value === 1);
        if (!allOnes) {
          return this.responses.errorResponse(
            allOnes + ' please check the questions these are alreay added',
          );
        }
        // const getFormId = await this.getFormId();
        // const saveForm = await this.formRepository.save({
        //   title: getFormId,
        //   created_by: request.user.user_id,
        // });
        const metchantId = await this.commonServices.getMerchantId(
          request.user.merchant,
        );
        const checkQuestionsSame = this.hasDuplicateTitles(questions); //in incoming array
        if (checkQuestionsSame)
          return this.responses.errorResponse('Questions should be different');

        //save questions
        console.log(questions);
        const saveData = await Promise.all(
          questions.map(async (qstn: any) => {
            const saveQstns = await this.questionRepository.save({
              question_type: qstn.question_type,
              title: qstn.title,
              form_id: form_id,
              created_by: request.user.user_id,
              merchant_id: metchantId,
              event_type: event_type,
              // event_type_id: event_type_id,
            });
            if (qstn.question_type != 1) {
              qstn.options.map(async (option: any) => {
                const saveQstnsOptions =
                  await this.questionoptionRepository.save({
                    question_id: saveQstns.id,
                    option: option,
                    created_by: request.user.user_id,
                  });
              });
            }
          }),
        );
        if (saveData) return this.responses.successResponse(saveData);
        return this.responses.errorResponse('Something went wrong');
        //-------------end---------------
      } catch (error) {
        this.logger.error(
          error.message,
          error.stack,
          'QuestionnaireService.deleteQuestionnaire',
        );
        throw error;
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'QuestionnaireService.deleteQuestionnaire',
      );
      throw error;
    }
  }
  async deleteQuestion({ user_id, form_id }: DeleteQuestionsByIdDto, request) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      const checkExist = await this.questionRepository.findByCondition({
        form_id: form_id,
      });
      if (checkExist.length === 0)
        return this.responses.errorResponse('Form not found');
      //-----deleting questionnaire start---------
      const deleteQuestion = await this.questionRepository.findAndUpdate(
        { form_id: form_id },
        { status: Status.Inactive, delete_status: 1 },
      );

      await Promise.all(
        checkExist.map(async (qstn: any) => {
          if (deleteQuestion) {
            await this.questionoptionRepository.findAndUpdate(
              { question_id: qstn.id },
              { status: Status.Inactive, delete_status: 1 },
            );
          } else {
            return this.responses.errorResponse('Something went wrong');
          }
        }),
      );
      //------------------end---------------
      return this.responses.successResponse(deleteQuestion);
    } catch (error) {
      this.logger.error(error.message, error.stack, 'RoleService.deleteRole');
      throw error;
    }
  }
  async getFormId() {
    const lastAddedKey = await this.formRepository.findByConditionithSort(
      {
        delete_status: 0,
      },
      'id: desc',
    );
    let uniqueId = ''; // Initialize the uniqueId variable

    if (!lastAddedKey || lastAddedKey.length === 0) {
      // If there are no records in the database, generate a new ID from scratch
      const prefixString = 'FORM';
      const initialCount = 1000; // Initial count value
      const d = new Date();
      const year = d.getFullYear();
      uniqueId = `${prefixString}-${initialCount}-${year}`;
    } else {
      // const lastObject = lastAddedKey[lastAddedKey.length - 1];
      const lastObject = lastAddedKey[0];
      const lastTransaction = lastObject.title;

      if (!lastTransaction) {
        // If the last record has no form_id, generate a new ID from scratch
        const prefixString = 'FORM';
        const initialCount = 1000; // Initial count value
        const d = new Date();
        const year = d.getFullYear();
        uniqueId = `${prefixString}-${initialCount}-${year}`;
      } else {
        const splitTheCount = lastTransaction.split('-');
        const countIncrement = parseInt(splitTheCount[1]) + 1; // Increment the middle part
        splitTheCount[1] = countIncrement.toString();
        uniqueId = splitTheCount.join('-');
      }
    }

    return uniqueId;
  }
  hasDuplicateTitles(arr) {
    const titleSet = new Set(); // Use a Set to store unique titles
    for (const obj of arr) {
      if (titleSet.has(obj.title)) {
        // If the title is already in the Set, we found a duplicate title
        return true;
      }
      titleSet.add(obj.title); // Add the title to the Set
    }
    return false; // No duplicates found
  }
}
