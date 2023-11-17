import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class MergeAccountDtoDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  google_token: string;
  // @IsNotEmpty()
  @ApiProperty()
  device_token: string;

  // @IsNotEmpty()
  @ApiProperty()
  device_type: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  google_profile_pic: string;

  @ApiProperty()
  mobile_number: string;

  @ApiProperty()
  role_id: number;
}
