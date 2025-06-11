// pages/api/proxy.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const rawKey = process.env.DIFY_API_KEY;
    if (!rawKey) {
        return res.status(400).json({
            name: 'BadRequest',
            message: 'Missing API key in env',
            code: 400,
            className: 'bad-request',
            data: { error: 'Missing API key in env' },
            errors: {}
        });
    }

    const { path, payload } = req.body;
    if (!path || !payload) {
        return res.status(400).json({ error: 'Missing path or payload' });
    }

    try {
        const targetUrl = `https://api.dify.ai/v1/${path}`;

        const apiRes = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: rawKey,
            },
            body: JSON.stringify(payload),
        });

        const data = await apiRes.json();
        res.status(apiRes.status).json(data);
    } catch (error: any) {
        console.error('❌ Proxy Error:', error);
        res.status(500).json({
            name: 'ProxyError',
            message: 'Internal proxy error',
            detail: error?.message || 'Unknown error'
        });
    }
}