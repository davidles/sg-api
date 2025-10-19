import express from 'express';
import requestsRouter from './routes/requests';
import titlesRouter from './routes/titles';

const app = express();

app.use(express.json());

app.use('/requests', requestsRouter);
app.use('/titles', titlesRouter);

export default app;
