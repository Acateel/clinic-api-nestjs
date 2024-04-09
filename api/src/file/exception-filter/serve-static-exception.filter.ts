import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

@Catch()
export class ServeStaticExceptionFilter extends BaseExceptionFilter {
  constructor(adapter: AbstractHttpAdapter) {
    super(adapter);
  }

  catch(exception, host: ArgumentsHost) {
    if (exception instanceof HttpException || exception.code !== 'ENOENT') {
      super.catch(exception, host);
      return;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.sendStatus(HttpStatus.NOT_FOUND);
  }
}
