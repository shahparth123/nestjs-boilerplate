import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class UploadFileDTO {

  @ApiProperty()
  @IsNotEmpty()
  file: File;

}
