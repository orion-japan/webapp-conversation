import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.DIFY_API_KEY;

    // 🔍 ログで確認
    console.log('🔍 DIFY_API_KEY from env:', apiKey);

    if (!apiKey) {
        return res.status(400).json({ error: 'Missing API key in env' });
    }

    try {
        const apiRes = await fetch('https://api.dify.ai/v1/chat-messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey,
            },
            body: JSON.stringify(req.body),
        });

        const data = await apiRes.json();
        console.log('✅ Dify response:', data);
        res.status(apiRes.status).json(data);
    } catch (err: any) {
        console.error('❌ Proxy error:', err);
        res.status(500).json({ error: 'Proxy request failed', detail: err.message });
    }
}
