import { Test, TestingModule } from '@nestjs/testing';
import { FaqService } from './faq.service';

describe('CategoryService', () => {
  let service: FaqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FaqService],
    }).compile();

    service = module.get<FaqService>(FaqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
