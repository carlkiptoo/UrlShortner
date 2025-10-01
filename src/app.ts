import express from 'express';
import shortenRouter from './routes/shorten.js';
import redirectRouter from './routes/redirect.js';
import {limiter} from './middleware/rateLimiter.js';
import morgan from 'morgan';
import {logger} from './utils/logger.js';


const app = express();

app.use(express.json());

app.use(morgan('combined', {
    skip: (req: express.Request) => req.url === '/api/live/ws',
    stream: {
        write: (message: any) => logger.info(message.trim()),
    },
}));

app.use('/api/shorten', limiter, shortenRouter);
app.use('/', limiter, redirectRouter);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error(`${err.message}\n${err.stack}`);
    res.status(500).json({error: 'Internal Server Error'});
})

process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`, {stack: error.stack});
    process.exit(1)
});

process.on('unhandledRejection', (reason: any) => {
    logger.error(`Unhandled Rejection: ${reason?.message || reason}`, {reason});
})

export default app;