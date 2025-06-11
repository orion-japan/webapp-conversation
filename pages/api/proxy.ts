// pages/api/proxy.ts

import type { NextApiRequest, NextApiResponse } from 'next';

const DIFY_API_URL = 'https://api.dify.ai/v1/chat-messages';
const apiKey = process.env.DIFY_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { inputs = {}, query, response_mode = 'blocking', conversation_id = '', user = '' } = req.body;

        const response = await fetch(DIFY_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                inputs,
                query,
                response_mode,
                conversation_id,
                user,
            }),
        });

        const data = await response.json();

        res.status(response.status).json(data);
    } catch (error: any) {
        console.error('🔴 Proxy Error:', error);
        res.status(500).json({ error: 'Proxy request failed' });
    }
}
console.log('🔵 Proxying to Dify with:', {
    query,
    inputs,
    user,
    conversation_id,
    apiKeyPresent: !!apiKey,
});
