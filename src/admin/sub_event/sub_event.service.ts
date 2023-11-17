import { Inject, Injectable, Logger } from '@nestjs/common';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { ResponsesData } from 'src/common/library/response.data';
import { CommonServices } from 'src/common/services/common.service';

import { SubEventParticipateRepositoryInterface } from './interface/subevent_participate.repository.interface';
import { AddSubEventParticipateDto } from './dto/addSubeventParticipate.dto';
import { SubEventQuestionAnswerRepositoryInterface } from './interface/subevent_event_question_answer.repository.interface';

@Injectable()
export class SubEventService {
  constructor(
    @Inject('SubEventQuestionAnswerRepositoryInterface')
    private readonly subEventQuestionAnswerRepository: SubEventQuestionAnswerRepositoryInterface,
    @Inject('SubEventParticipateRepositoryInterface')
    private readonly subEventParticipateRepository: SubEventParticipateRepositoryInterface,
    private responses: ResponsesData,
    private commonValidation: CommonValidation,
    private readonly logger: Logger,
    private commonServices: CommonServices,
  ) {}

  async addSubEventParticipate(
    addPartcipateDto: AddSubEventParticipateDto,
    request,
  ): Promise<any> {
    const { user_id, booking_id, event_id, sub_event_id, question_answers } =
      addPartcipateDto;
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }

      const checkUserExist =
        await this.subEventParticipateRepository.findByCondition({
          user_id: user_id,
          sub_event_id: sub_event_id,
        });

      if (checkUserExist.length > 0)
        if (question_answers.length > 0) {
          // return this.responses.errorResponse('Already added participation');

          //....Questionnaires.....
          /* Validation */
          const qstnValidation =
            await this.commonServices.questionAnsweValidationBooking(
              event_id,
              question_answers,
            );
          if (qstnValidation === 0)
            return this.responses.errorResponse('Forms not found');
          if (qstnValidation === 1)
            return this.responses.errorResponse('Please answer all questions');
          if (qstnValidation === 2)
            return this.responses.errorResponse(
              'Only answer the prefered form questions',
            );
        }
      /*Save*/

      if (question_answers.length > 0) {
        const saveAnswersPromises = question_answers.map(async (qstn: any) => {
          const dataAnswers = {
            booking_id: booking_id,
            question_id: qstn.question_id,
            event_id: event_id,
            sub_event_id: sub_event_id,
            option: qstn.option
              ? qstn.option.length > 0
                ? JSON.stringify(qstn.option)
                : null
              : null,
            text_answer: qstn.text_answer ?? null,
          };

          const data = await this.subEventQuestionAnswerRepository.save(
            dataAnswers,
          );
          console.log(data);
        });
        await Promise.all(saveAnswersPromises);
      }
      //....End of questionnaire ....

      const participate = {
        user_id: user_id,
        booking_id: booking_id,
        event_id: event_id,
        sub_event_id: sub_event_id,
        status: 1,
      };
      const data = await this.subEventParticipateRepository.save(participate);
      if (data) {
        return this.responses.successResponse(data);
      }

      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'SubEventService.addSubEventParticipate',
      );
      return this.responses.errorResponse(error);
    }
  }
}
