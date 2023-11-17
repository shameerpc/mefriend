import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetBookingHistoryDto {
  @IsNotEmpty()
  @ApiProperty()
  user_id: number;

  @IsOptional()
  event_id: number | undefined;

  @IsOptional()
  booking_id: number | undefined;

  @IsOptional()
  event_ticket_type_id: number | undefined;

  @IsOptional()
  search?: string | undefined;

  @ApiProperty()
  @IsOptional()
  readonly page: number | undefined;

  @ApiProperty()
  @IsOptional()
  readonly limit: number | undefined;
}
