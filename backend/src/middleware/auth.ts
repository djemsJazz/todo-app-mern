import { NextFunction, Request, Response } from 'express';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const headers = req.headers;
  try {
    const token = headers?.authorization?.split(' ')[1];
    if (!token) {
      res.status(401);
      throw new Error('Unauthorized');
    }
  } catch (error) {
    return next(error);
  }
};

export default auth;
