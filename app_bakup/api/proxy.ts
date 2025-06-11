// pages/api/proxy.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, body, headers, query } = req;

    // Dify API のエンドポイント
    const targetUrl = `https://api.dify.ai${query.path ? '/' + query.path : ''}`;

    try {
        const apiRes = await fetch(targetUrl, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DIFY_API_KEY || ''}`,
                // 他の必要なヘッダーがあれば追加
            },
            body: method !== 'GET' ? JSON.stringify(body) : undefined,
        });

        const data = await apiRes.json();
        res.status(apiRes.status).json(data);
    } catch (error: any) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Proxy request failed', detail: error.message });
    }
};

export default handler;