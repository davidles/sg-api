import express from 'express';
import cors, { CorsOptions } from 'cors';
import requestsRouter from './routes/requests';
import titlesRouter from './routes/titles';
import formsRouter from './routes/forms';
import usersRouter from './routes/users';

const app = express();

const ALLOWED_ORIGINS = (process.env.CORS_ALLOWED_ORIGINS ?? 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const CORS_OPTIONS: CorsOptions = {
  origin(
    requestOrigin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!requestOrigin || ALLOWED_ORIGINS.includes(requestOrigin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${requestOrigin} not allowed by CORS.`));
  },
  credentials: true
};

app.use(cors(CORS_OPTIONS));
app.options(/.*/, cors(CORS_OPTIONS));

app.use(express.json());

app.use('/api/requests', requestsRouter);
app.use('/api/titles', titlesRouter);
app.use('/api/forms', formsRouter);
app.use('/api/users', usersRouter);

export default app;
