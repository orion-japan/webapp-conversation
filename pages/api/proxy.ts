import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method, body, query } = req;

    const targetPath = Array.isArray(query.path) ? query.path.join('/') : query.path || '';
    const targetUrl = `https://api.dify.ai/${targetPath}`;

    const apiKey = process.env.DIFY_API_KEY;

    if (!apiKey) {
        console.error('❌ Missing DIFY_API_KEY in environment variables');
        return res.status(500).json({ error: 'Missing API Key' });
    }

    try {
        const apiRes = await fetch(targetUrl, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: method !== 'GET' ? JSON.stringify(body) : undefined,
        });

        const data = await apiRes.json();
        res.status(apiRes.status).json(data);
    } catch (error) {
        console.error('🔥 Proxy error:', error);
        res.status(500).json({ error: 'Proxy request failed' });
    }
}