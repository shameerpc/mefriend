import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CancelBookingByIdDto {
  @ApiProperty()
  @IsOptional()
  booking_id: number | undefined;
}
