/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { bool } from 'aws-sdk/clients/signer';

export class UpdateSupportTicketDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly user_id: number;

  @IsNotEmpty()
  @ApiProperty()
  readonly ticket_id: number;

  @IsOptional()
  @ApiProperty()
  is_closed?: boolean;
}
