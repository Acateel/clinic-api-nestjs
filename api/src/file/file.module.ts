import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileController } from './file.controller';
import { storage } from './util';

@Module({
  imports: [
    MulterModule.register({
      storage,
    }),
  ],
  controllers: [FileController],
  exports: [MulterModule],
})
export class FileModule {}
