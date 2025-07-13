import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';

import User from '../models/user.model';
import { IUser } from '../types/user';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { body: payload } = req;
  try {
    const { email } = payload;
    const existsUser = await User.findOne({ email });
    if (existsUser) {
      res.status(409);
      throw new Error('User already Exists');
    }
    const hash = await bcrypt.hash(payload.password, 10);
    const newUser: IUser = await new User({ ...payload, password: hash }).save();
    return res.status(201).send(newUser);
  } catch (error) {
    return next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    return res.status(200).send(users);
  } catch (error) {
    return next(error);
  }
};
