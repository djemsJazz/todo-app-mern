import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';

import User from '../models/user.model';
import { IUser } from '../types/user';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { body: payload } = req;
  try {
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

export const checkUserExistanceByMail = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  try {
    if (!email) {
      res.status(400);
      throw new Error('Email is not in the request');
    }
    const existsUser = await User.findOne({ email });
    if (existsUser) {
      res.status(409);
      throw new Error('User already Exists');
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

export const updateUserEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { params: { id }, body: { email } } = req;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { email }, { new: true });
    return res.status(200).send(updatedUser);
  } catch (error) {
    return next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { params: { id }, body } = req;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { ...body }, { new: true });
    return res.status(200).send(updatedUser);
  } catch (error) {
    return next(error);
  }
};


