import express from 'express';
import shortenRouter from './routes/shorten.js';
import redirectRouter from './routes/redirect.js';

const app = express();

app.use(express.json());
app.use('/api/shorten', shortenRouter);
app.use('/', redirectRouter);

export default app;