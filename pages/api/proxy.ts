// pages/api/proxy/[...path].ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // ✅ POST以外は拒否
    if (req.method !== 'POST') {
        return res.status(405).json({
            name: 'MethodNotAllowed',
            message: 'Only POST requests are allowed',
            code: 405,
        });
    }

    // ✅ クエリパス（chat-messages など）取得
    const pathArray = req.query.path;
    const path = Array.isArray(pathArray) ? pathArray.join('/') : pathArray;

    if (!path) {
        return res.status(400).json({
            name: 'BadRequest',
            message: 'Missing path in URL',
            code: 400,
        });
    }

    // ✅ APIキー取得（.env.local に DIFY_API_KEY を定義しておくこと）
    const DIFY_API_KEY = process.env.DIFY_API_KEY;

    if (!DIFY_API_KEY) {
        return res.status(500).json({
            name: 'ServerError',
            message: 'Missing API Key',
        });
    }

    // ✅ DifyのAPIエンドポイント作成
    const targetUrl = `https://api.dify.ai/v1/${path}`;

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: DIFY_API_KEY,
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();

        return res.status(response.status).json(data);
    } catch (err) {
        console.error('Proxy Error:', err);
        return res.status(500).json({
            name: 'ProxyError',
            message: 'Failed to fetch from Dify',
        });
    }
}