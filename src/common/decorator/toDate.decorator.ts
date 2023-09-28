import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ToDate = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.query.toDate) {
      return new Date(request.query.toDate);
    }

    return null;
  },
);
