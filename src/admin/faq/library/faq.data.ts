import { FaqEntity } from 'src/typeOrm/entities/Faq';

export class FaqData {
  async createResponse(input: FaqEntity) {
    const data = {
      faq_id: input.id,
      question: input.question,
      answer: input.answer,
      status: input.status,
    };
    return data;
  }
}
