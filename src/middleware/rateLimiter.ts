import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import {redis} from '../config/redis.js';


export const limiter = rateLimit({
    store: new RedisStore({
        sendCommand: async (command: string, ...args: (string | number)[]) => {
            return await redis.call(command, ...args) as any;
        },
    }),
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: 'Too many requests from this IP, please try again later',
});