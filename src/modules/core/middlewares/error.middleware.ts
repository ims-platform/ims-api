import { NextFunction, Request, Response } from 'express';

import { HttpException } from '@/modules/core/exceptions/http.exception';
import { HttpResponse } from '@/modules/core/response/http.response';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('[Error]:', error);

  if (error instanceof HttpException) {
    HttpResponse.failure(res, error.status, error.message, error.errors);
    return;
  }

  HttpResponse.failure(res, 500, 'Internal server error');
};
