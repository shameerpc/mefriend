import { Test, TestingModule } from '@nestjs/testing';
import { EventTicketController } from './eventticket.controller';

describe('EventTicketController', () => {
  let controller: EventTicketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventTicketController],
    }).compile();

    controller = module.get<EventTicketController>(EventTicketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
