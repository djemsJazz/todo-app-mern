import express, { Express, Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';

import errorMiddleware from './middleware/error-middleware';
import apiRouter from './routes';
import auth from './middleware/auth';

const app: Express = express();

app.use(cors({
  origin: process.env.FRONT_END_URL,
  optionsSuccessStatus: 200,
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());

app.get('/test', (req, res, next) => {
  try {
    res.status(401);
    throw new Error('TESTING ERROR MIDDLEWARE');
  } catch (error) {
    return next(error);
  }
});

app.use('/api', apiRouter);
app.get('/test-auth', auth, (req: Request, res: Response) => {
  return res.sendStatus(200);
});

app.use((req, res) => {
  res.sendStatus(404);
});
app.use(errorMiddleware);

export default app;
