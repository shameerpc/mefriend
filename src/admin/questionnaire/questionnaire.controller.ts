/* eslint-disable prettier/prettier */
import { Multer } from 'multer';
import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  UsePipes,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
  HttpCode,
  HttpException,
  HttpStatus,
  UseGuards,
  SetMetadata,
  UploadedFiles,
  Request,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateQuestionsDto } from './dto/addquestionnaire.dto';
import { QuestionService } from './questionnaire.service';
import { GetQuestionsDto } from './dto/getquestionnaire.dto';
import { GetQuestionsByIdDto } from './dto/getquestionsbyid.dto';
import { UpdateQuestionsDto } from './dto/updatequestion.dto';
import { DeleteQuestionsByIdDto } from './dto/deletequestion.dto';

@ApiTags('Questionnaire Management')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseGuards(PermissionsGuard)
@Controller()
export class questionnaireController {
  constructor(private questionService: QuestionService) {}

  @Post('/create-questions')
  @HttpCode(200)
  @SetMetadata('permissions', ['write-questions'])
  async create(
    @Request() request,
    @Body() createQuestionsDto: CreateQuestionsDto,
  ): Promise<any> {
    return this.questionService.createQuestion(createQuestionsDto, request);
  }
  @Post('/get-questions')
  @HttpCode(200)
  @SetMetadata('permissions', ['read-questions'])
  async getQuestions(
    @Request() request,
    @Body() getQuestionsDto: GetQuestionsDto,
  ): Promise<any> {
    return this.questionService.getQuestions(getQuestionsDto, request);
  }

  @Post('/get-questions-by-id')
  @HttpCode(200)
  @SetMetadata('permissions', ['read-questions'])
  async getQuestionsById(
    @Request() request,
    @Body() getQuestionsByIdDto: GetQuestionsByIdDto,
  ): Promise<any> {
    return this.questionService.getQuestionsById(getQuestionsByIdDto, request);
  }

  @Post('/update-question')
  @HttpCode(200)
  @SetMetadata('permissions', ['update-questions'])
  async updateQuestions(
    @Request() request,
    @Body() UpdateQuestionsDto: UpdateQuestionsDto,
  ): Promise<any> {
    return this.questionService.updateQuestion(UpdateQuestionsDto, request);
  }
  //Commented by Athira : As per the discussion get questions api simiar to this.both accepts form id as the input param
  // @Post('/get-questions-by-id')
  // @HttpCode(200)
  // @SetMetadata('permissions', ['read-questions'])
  // async updateQuestion(
  //   @Request() request,
  //   @Body() updateQuestionDto: UpdateQuestionsDto,
  // ): Promise<any> {
  //   return this.questionService.updateQuestion(updateQuestionDto, request);
  // }
  @Post('/delete-question')
  @HttpCode(200)
  @SetMetadata('permissions', ['delete-questions'])
  async deleteQuestion(
    @Request() request,
    @Body() deleteQuestionsByIdDto: DeleteQuestionsByIdDto,
  ): Promise<any> {
    return this.questionService.deleteQuestion(deleteQuestionsByIdDto, request);
  }
}
