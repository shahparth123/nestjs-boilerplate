import { Module, Global } from '@nestjs/common';
import { databaseProviders } from './database.service';

@Global()
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
