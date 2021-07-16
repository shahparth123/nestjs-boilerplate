import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { IsStrongPassword } from '../../../decorator/password.decorator';

export class VerifyEmailDTO {

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;

}
