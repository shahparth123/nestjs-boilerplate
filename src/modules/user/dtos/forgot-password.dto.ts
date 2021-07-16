import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class ForgotPasswordDTO {

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

}
