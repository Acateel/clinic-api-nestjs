import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { FileModule } from 'src/file/file.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, FileModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
