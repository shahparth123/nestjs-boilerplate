import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './providers/database/database.module';
import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [UserModule, AuthModule, DatabaseModule, FilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
