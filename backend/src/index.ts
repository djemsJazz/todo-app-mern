/* eslint-disable no-console */
import express, { Express } from 'express';

const app: Express = express();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
