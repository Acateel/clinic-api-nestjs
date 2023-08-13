import { Request, Response, NextFunction } from 'express';
import * as qs from 'qs';
import { In } from 'typeorm';
import { ReadOptions } from '../interface';

export const typeOrmFindOptionsQueryMapperMiddleware = (
  req: Request<unknown, unknown, unknown, ReadOptions<unknown>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const string = qs.stringify(req.query, {
      filter: (prefix: string, value: unknown): unknown => {
        if (typeof value === 'string' && value.startsWith(' ')) {
          return value.replace(' ', '+');
        }
        return value;
      },
    });

    const mappedQuery: any = qs.parse(string, { allowDots: true });

    if (mappedQuery.filter) {
      for (const key in mappedQuery.filter as object) {
        if (Object.prototype.hasOwnProperty.call(mappedQuery.filter, key)) {
          const values = mappedQuery.filter[key];
          if (Array.isArray(values)) {
            mappedQuery.filter[key] = In(values);
          }
        }
      }
    }

    req.query.find = {
      where: mappedQuery.filter,
      order: mappedQuery.sort,
      skip: mappedQuery.skip,
      take: mappedQuery.take,
    };

    next();
  } catch (error) {
    next(error);
  }
};
