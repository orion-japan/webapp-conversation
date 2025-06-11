import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const apiKey = process.env.DIFY_API_KEY;

    // ✅ 環境変数のログ出力（安全な確認）
    if (!apiKey) {
        console.error('❌ DIFY_API_KEY is missing');
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

    return res.status(200).json({
        message: '✅ API key received on server',
        preview: apiKey.substring(0, 8) + '...' // セキュリティのため一部だけ表示
    });
}