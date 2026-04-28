import { NextFunction, Request, Response } from 'express';

import { ZodError, ZodObject, ZodRawShape } from 'zod';

import { HttpException } from '@/modules/core/exceptions/http.exception';

export const validateSchema =
  (schema: ZodObject<ZodRawShape>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body) as unknown;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(HttpException.badRequest('Datos de entrada inválidos', error.flatten().fieldErrors));
      } else {
        next(error);
      }
    }
  };
