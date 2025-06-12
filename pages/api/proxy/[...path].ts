import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.DIFY_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Missing API Key in env' });
    }

    const pathArray = req.query.path as string[] | undefined;
    if (!pathArray || pathArray.length === 0) {
        return res.status(400).json({ error: 'Missing path' });
    }

    const targetPath = pathArray.join('/');
    const targetUrl = `https://api.dify.ai/v1/${targetPath}`;

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
        res.status(500).json({ error: 'Internal proxy error', detail: error?.message });
    }
}