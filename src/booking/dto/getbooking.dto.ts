import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetBookingDto {
  @IsNotEmpty()
  @ApiProperty()
  user_id: number;

  @IsOptional()
  @ApiProperty()
  event_id: number | undefined;

  @ApiProperty()
  @IsOptional()
  booking_id: number | undefined;

  @ApiProperty()
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
