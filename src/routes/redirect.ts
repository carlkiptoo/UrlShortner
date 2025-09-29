import { Router } from 'express';
import { redis } from '../config/redis';
import {pool} from '../config/db';

const router = Router();

router.get('/:code', async (req: any, res: any) => {
    const {code} = req.params;

    const cached = await redis.get(`s:${code}`);
    if (cached) {
        redis.incr(`c:${code}`);
        return res.redirect(302, cached);
    }

    const {rows} = await pool.query("SELECT long_url, disabled, expires_at FROM urls WHERE short_code = $1", [code]);
    if (rows.length === 0) {
        return res.status(404).send("Not Found");
    }

    const url = rows[0];
    if (url.disabled || (url.expires_at && new Date(url.expires_at) < new Date())) {
        return res.status(410).send("Link has been disabled");
    }

    await redis.set(`s:${code}`, url.long_url, "EX", 3600);
    redis.incr(`c:${code}`);

    return res.redirect(302, url.long_url);
});

export default router;