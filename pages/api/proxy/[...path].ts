// pages/api/proxy/[...path].ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
        const options: RequestInit = {
            method: req.method,
            headers: {
                'Authorization': apiKey,
            },
        };

        if (req.method === 'POST') {
            options.headers = {
                ...options.headers,
                'Content-Type': 'application/json',
            };
            options.body = JSON.stringify(req.body);
        }

        const response = await fetch(targetUrl, options);
        const data = await response.json();

        res.status(response.status).json(data);
    } catch (error: any) {
        console.error('❌ Proxy Error:', error);
        res.status(500).json({
            name: 'ProxyError',
            message: 'Internal proxy error',
            detail: error?.message || 'Unknown error',
        });
    }
}