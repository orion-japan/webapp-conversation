
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const apiKey = process.env.DIFY_API_KEY;
    const baseUrl = 'https://api.dify.ai/v1';

    if (!apiKey || !apiKey.startsWith('Bearer ')) {
        return res.status(500).json({ error: 'Invalid or missing API key' });
    }

    if (req.method === 'POST') {
        const { inputs, query, response_mode, user, conversation_id } = req.body;

        try {
            const response = await fetch(`${baseUrl}/chat-messages`, {
                method: 'POST',
                headers: {
                    'Authorization': apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputs, query, response_mode, user, conversation_id })
            });

            const data = await response.json();
            console.log('📩 POST to /chat-messages', data);
            return res.status(response.status).json(data);
        } catch (error) {
            console.error('❌ POST error:', error);
            return res.status(500).json({ error: 'Failed to send chat message' });
        }
    }

    if (req.method === 'GET') {
        const { user, conversation_id } = req.query;

        console.log('📥 messages.ts GET 呼び出し:', req.query);

        if (!user || typeof user !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid user parameter' });
        }

        if (!conversation_id || typeof conversation_id !== 'string') {
            return res.status(200).json({ messages: [] });
        }

        const url = `${baseUrl}/messages?user=${encodeURIComponent(user)}&conversation_id=${encodeURIComponent(conversation_id)}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': apiKey
                },
            });
            const data = await response.json();
            console.log('📦 GET応答:', data);
            return res.status(response.status).json(data);
        } catch (error) {
            console.error('❌ GET error:', error);
            return res.status(500).json({ error: 'Failed to fetch messages' });
        }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}
