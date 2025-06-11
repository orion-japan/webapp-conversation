// pages/api/proxy.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { query, inputs, response_mode, conversation_id, user } = req.body;

    const DIFY_API_KEY = process.env.DIFY_API_KEY;
    const apiUrl = 'https://api.dify.ai/v1/chat-messages';

    if (!DIFY_API_KEY) {
        console.error('❌ Missing DIFY_API_KEY in environment variables');
        return res.status(500).json({ error: 'Missing API key' });
    }

    try {
        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': DIFY_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: inputs || {},
                query,
                response_mode: response_mode || 'blocking',
                conversation_id,
                user,
            }),
        });

        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            console.error('🔴 API Error:', data);
            return res.status(apiResponse.status).json({ error: data });
        }

        // 通常レスポンス
        return res.status(200).json(data);
    } catch (error: any) {
        console.error('❌ Proxy error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            detail: error.message,
        });
    }
}