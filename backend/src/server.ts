/* eslint-disable no-console */
import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 3000;
const dbHost = process.env.DB_CNX_STR;

mongoose.connect(dbHost as string).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('DB Connection error', err);
});
