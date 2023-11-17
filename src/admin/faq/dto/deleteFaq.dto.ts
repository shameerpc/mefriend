import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteFaqDto {
  @IsNotEmpty()
  @ApiProperty({
    type: [Number],
    description: 'Array of Faq IDs to be deleted',
    example: [1, 2, 3],
  })
  faq_ids: number[];
}
