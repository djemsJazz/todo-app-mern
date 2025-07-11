import express from 'express';
import userRouter from './helpers/user.router';

const apiRouter =  express.Router();

apiRouter.use('/users', userRouter);

export default apiRouter;
