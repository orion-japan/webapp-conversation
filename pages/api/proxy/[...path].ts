import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST' && req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.DIFY_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Missing API Key' });
    }

    const pathArray = req.query.path as string[] | undefined;
    if (!pathArray || pathArray.length === 0) {
        return res.status(400).json({ error: 'Missing path' });
    }

    const targetUrl = `https://api.dify.ai/v1/${pathArray.join('/')}`;

    try {
        const apiRes = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: apiKey,
            },
            body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
        });

        const data = await apiRes.json();
        res.status(apiRes.status).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Proxy error', detail: (err as any)?.message });
    }
}
