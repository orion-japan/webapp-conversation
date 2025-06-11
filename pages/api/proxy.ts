// pages/api/proxy.ts

import type { NextApiRequest, NextApiResponse } from 'next';

const apiKey = process.env.DIFY_API_KEY;
const targetUrl = 'https://api.dify.ai/v1/chat-messages';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { query, inputs = {}, user = '', conversation_id = '' } = req.body;

        const apiRes = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                query,
                inputs,
                user,
                response_mode: 'blocking',
                conversation_id,
            }),
        });

        const data = await apiRes.json();

        res.status(apiRes.status).json(data);
    } catch (error: any) {
        console.error('🔴 Proxy Error:', error);
        res.status(500).json({ error: 'Proxy request failed' });
    }
}