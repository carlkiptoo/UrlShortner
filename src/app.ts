import express from 'express';
import shortenRouter from './routes/shorten.js';
import redirectRouter from './routes/redirect.js';
import {limiter} from './middleware/rateLimiter.js';

const app = express();

app.use(express.json());
app.use('/api/shorten', limiter, shortenRouter);
app.use('/', limiter, redirectRouter);

export default app;