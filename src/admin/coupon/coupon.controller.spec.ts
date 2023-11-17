import { Test, TestingModule } from '@nestjs/testing';
import { couponController } from './coupon.controller';

describe('couponController', () => {
  let controller: couponController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [couponController],
    }).compile();

    controller = module.get<couponController>(couponController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
