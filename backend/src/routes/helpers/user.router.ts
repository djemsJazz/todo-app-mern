import express from 'express';
import { checkUserExistanceByMail, create } from '../../controlers/user.controler';
import { userCreateValidator } from '../../validators/user.validator';

const userRouter = express.Router();

userRouter.post('/', userCreateValidator, checkUserExistanceByMail, create);

export default userRouter;