import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // ✅ POST以外は拒否
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // ✅ Dify APIキー（Vercel上に設定された環境変数から）
    const apiKey = process.env.DIFY_API_KEY;

    // ✅ ログで確認（本番時は削除）
    console.log('🔍 DIFY_API_KEY:', apiKey);

    if (!apiKey) {
        return res.status(400).json({
            name: 'BadRequest',
            message: 'Error',
            code: 400,
            className: 'bad-request',
            data: {
                error: 'Missing API key in env',
            },
            errors: {}
        });
    }

    // ✅ Dify APIエンドポイント
    const targetUrl = 'https://api.dify.ai/v1/chat-messages';

    try {
        const apiRes = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey, // ここで Bearer を含めてください（環境変数にセット済みの形式で）
            },
            body: JSON.stringify(req.body),
        });

        const data = await apiRes.json();

        // ✅ 結果をそのまま返す
        res.status(apiRes.status).json(data);

    } catch (error: any) {
        console.error('❌ Proxy Error:', error);
        res.status(500).json({
            name: 'ProxyError',
            message: 'Internal proxy error',
            detail: error?.message || 'Unknown error'
        });
    }
}