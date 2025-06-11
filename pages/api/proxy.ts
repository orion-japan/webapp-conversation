// pages/api/proxy.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // ✅ ログで環境変数の有無を確認
    console.log('🔍 DIFY_API_KEY:', process.env.DIFY_API_KEY);

    const rawKey = process.env.DIFY_API_KEY;

    if (!rawKey) {
        return res.status(400).json({
            name: 'BadRequest',
            message: 'Error',
            code: 400,
            className: 'bad-request',
            data: {
                error: 'Missing API key in env'
            },
            errors: {}
        });
    }

    const apiKey = rawKey.startsWith('Bearer ') ? rawKey : `Bearer ${rawKey}`;

    const { path } = req.query;
    if (!path || typeof path !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid API path' });
    }

    const targetUrl = `https://api.dify.ai/v1/${path}`;

    try {
        const apiRes = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey,
            },
            body: JSON.stringify(req.body),
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