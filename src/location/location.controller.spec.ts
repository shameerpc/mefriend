import { Test, TestingModule } from '@nestjs/testing';
import { locationController } from './location.controller';

describe('locationController', () => {
  let controller: locationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [locationController],
    }).compile();

    controller = module.get<locationController>(locationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
