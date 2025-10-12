import express from 'express';
import requestsRouter from './routes/requests';

const app = express();

app.use(express.json());

app.use('/requests', requestsRouter);

export default app;
