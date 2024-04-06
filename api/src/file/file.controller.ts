import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('files')
export class FileController {
  @Post('upload')
  // TODO: use util or config for settings
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload/',
        filename: (_, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
      //   fileFilter: imageFileFilter,
    }),
  )
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    // TODO: set path to user, return file name
    console.log(file);
  }
}
