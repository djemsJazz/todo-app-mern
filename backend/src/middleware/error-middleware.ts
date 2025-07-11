/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const status = res.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const stack = err.stack;
  res.status(status).json({ message, stack });
};

export default errorMiddleware;
