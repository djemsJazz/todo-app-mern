import express from 'express';
import { create } from '../../controlers/user.controler';
import { userCreateValidator } from '../../validators/user.validator';

const userRouter = express.Router();

userRouter.post('/', userCreateValidator, create);

export default userRouter;