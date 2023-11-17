import { IsNotEmpty, MaxLength, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTicketTypeDto {
  @IsNotEmpty()
  @ApiProperty()
  ticket_type_id: number;

  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(50)
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  status: number;
  @IsNotEmpty()
  @ApiProperty()
  @IsOptional()
  ticket_count: number;
  @IsNotEmpty()
  @ApiProperty()
  @IsOptional()
  price: number;
  @ApiProperty()
  @MaxLength(30)
  @MinLength(40)
  description: string;
}
