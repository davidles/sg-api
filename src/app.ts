import express from 'express';
import requestsRouter from './routes/requests';
import titlesRouter from './routes/titles';
import formsRouter from './routes/forms';

const app = express();

app.use(express.json());

app.use('/requests', requestsRouter);
app.use('/titles', titlesRouter);
app.use('/forms', formsRouter);

export default app;
