import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { IsStrongPassword } from '../../../decorator/password.decorator';

export class ChangePasswordDTO {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  old_password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword()
  new_password: string;

}
