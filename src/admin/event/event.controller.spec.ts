import { Test, TestingModule } from '@nestjs/testing';
import { eventController } from './event.controller';

describe('eventController', () => {
  let controller: eventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [eventController],
    }).compile();

    controller = module.get<eventController>(eventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
