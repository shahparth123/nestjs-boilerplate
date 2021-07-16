import { Body, Controller, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDTO } from './dtos/upload-file.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt/jwt-auth-guard.guard';
import { RBAC } from '../../decorator/rbac.decorator';

@Controller('files')
export class FilesController {
    constructor(private filesService: FilesService) { }

    @RBAC('admin')
    @Post('upload')
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file: any, @Request() request) {
        return await this.filesService.upload(file, request.user);
    }

    @RBAC('admin', 'customer', 'user')
    @Post('generatePutSignedURL')
    async generatePutSignedURL(@Body() body, @Request() request) {
        return await this.filesService.generatePutSignedURL(body, request.user);
    }


    @Post('generatePublicGetSignedURL')
    async generatePublicGetSignedURL(@Body() body, @Request() request) {
        return await this.filesService.generatePublicGetSignedURL(body, request.user);
    }


}
