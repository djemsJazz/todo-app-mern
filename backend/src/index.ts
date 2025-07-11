/* eslint-disable no-console */
import express, { Express } from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';

const app: Express = express();

const PORT = process.env.PORT || 3000;

const dbHost = process.env.DB_CNX_STR;

mongoose.connect(dbHost).then(() => {
  console.log('DB Connected');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('DB Connection error', err);
});

