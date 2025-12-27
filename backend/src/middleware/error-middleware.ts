/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'joi';

type JoiError = {
  error: ValidationError
}

const errorMiddleware = (err: Error | JoiError, req: Request, res: Response, next: NextFunction) => {
  const joiError = (err as JoiError).error;
  const { isJoi } = joiError || {};
  let status = res.statusCode || 500;
  if (joiError?.isJoi) { status = 400; }

  const message = isJoi ? joiError.toString() : (err as Error).message;
  const stack = (err as Error).stack;

  res.status(status).json({
    message,
    stack,
    ...(isJoi && { details: joiError.details })
  });
};

export default errorMiddleware;
