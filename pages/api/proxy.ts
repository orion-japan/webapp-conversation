// /pages/api/proxy.ts

import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const apiKey = process.env.DIFY_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: 'DIFY_API_KEY is not set' });
        return;
    }

    const targetUrl = 'https://api.dify.ai/v1/chat-messages';

    try {
        const { query, inputs, conversation_id, user } = req.body;

        const difyResponse = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query,
                inputs,
                user,
                response_mode: 'blocking',
                ...(conversation_id ? { conversation_id } : {}) // 省略可
            })
        });

        const data = await difyResponse.json();

        // Click向けに最低限の情報だけ返す場合：
        res.status(200).json({
            answer: data.answer,
            conversation_id: data.conversation_id,
            task_id: data.task_id,
            message_id: data.message_id,
            usage: data.metadata?.usage || {}
        });

    } catch (error: any) {
        console.error('🔴 Proxy error:', error);
        res.status(500).json({ error: 'Proxy request failed' });
    }
};

export default handler;