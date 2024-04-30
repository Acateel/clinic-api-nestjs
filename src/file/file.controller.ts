import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as path from 'path';

@Controller('files')
export class FileController {
  @Get(':name')
  get(@Param('name') name: string): StreamableFile {
    const filePath = path.resolve('public', 'upload', name);
    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }
}
