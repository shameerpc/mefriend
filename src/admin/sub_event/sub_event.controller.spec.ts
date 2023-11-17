import { Test, TestingModule } from '@nestjs/testing';
import { SubEventController } from './sub_event.controller';

describe('SubEventController', () => {
  let controller: SubEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubEventController],
    }).compile();

    controller = module.get<SubEventController>(SubEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
