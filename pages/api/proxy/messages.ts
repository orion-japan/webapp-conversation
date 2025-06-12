// pages/api/proxy/messages.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { user, conversation_id } = req.query;

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!user || !conversation_id) {
        return res.status(400).json({ error: 'Missing user or conversation_id' });
    }

    const apiKey = process.env.DIFY_API_KEY;
    const apiBase = 'https://api.dify.ai/v1';

    try {
        const response = await fetch(`${apiBase}/messages?user=${user}&conversation_id=${conversation_id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch message history' });
    }
}