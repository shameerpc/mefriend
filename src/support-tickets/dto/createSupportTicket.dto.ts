/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupportTicketDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly user_id: number;

  @IsNotEmpty()
  // @MaxLength(50)
  @ApiProperty()
  readonly title: string;

  @IsString()
  @ApiProperty()
  // @MaxLength(1500)
  readonly description: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
