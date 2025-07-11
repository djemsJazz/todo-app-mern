/* eslint-disable no-console */
import express, { Express } from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

import errorMiddleware from './middleware/error-middleware';

const app: Express = express();

const PORT = process.env.PORT || 3000;
const dbHost = process.env.DB_CNX_STR;

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

app.use((req, res) => {
  console.log('object');
  res.sendStatus(404);
});
app.use(errorMiddleware);

mongoose.connect(dbHost as string).then(() => {
  console.log('DB Connected');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('DB Connection error', err);
});

