import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const FromDate = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.query.fromDate) {
      return new Date(request.query.fromDate);
    }

    return null;
  },
);
