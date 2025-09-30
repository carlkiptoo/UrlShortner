import { Router } from 'express';
import { pool } from '../config/db.js';
import { encodeBase62 } from '../utils/base62.js';
import { isValidUrl } from '../utils/validateUrls.js';
import { isSafeUrl } from '../utils/isSafeUrl.js';
const router = Router();

router.post('/', async (req: any, res: any) => {
    const {long_url} = req.body;

    if (!long_url) {
        return res.status(400).json({error: 'long_url is required'});
    }

    if (!isValidUrl(long_url)) {
        return res.status(400).json({error: 'Invalid Url Format. Only http and https are supported'});
    }

    const safe = await isSafeUrl(long_url);
    if (!safe) {
        return res.status(400).json({error: 'URL points to a private IP address or hostname. Please use a public URL'});
    }
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const insert = await client.query(
            "INSERT INTO urls (long_url, short_code) VALUES ($1, '') RETURNING id",
            [long_url]
        );

        const id = insert.rows[0].id;
        const short_code = encodeBase62(id);

        await client.query("UPDATE urls SET short_code = $1 WHERE id = $2", [short_code, id]);
        await client.query('COMMIT');

        res.json({short_code: short_code, short_url: `http://localhost:3000/${short_code}`});
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    } finally {
        client.release();
    }

});

export default router;