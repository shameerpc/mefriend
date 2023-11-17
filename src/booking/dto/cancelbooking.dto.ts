import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsInt, IsNotEmpty } from 'class-validator';

export class CancelBookingDto {
  @IsInt()
  @ApiProperty()
  booking_id: number;

  @IsNotEmpty()
  @ApiProperty()
  user_id: number;

  @IsNumber()
  bookingStatus: number;
}

