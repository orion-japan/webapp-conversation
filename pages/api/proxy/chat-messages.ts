import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const apiKey = process.env.DIFY_API_KEY
    const baseUrl = 'https://api.dify.ai/v1'

    if (!apiKey || !apiKey.startsWith('Bearer ')) {
        return res.status(500).json({ error: 'Invalid or missing API key' })
    }

    if (req.method === 'POST') {
        const { inputs, query, response_mode, user, conversation_id } = req.body

        try {
            // conversation_id が未指定なら含めない（新規作成扱い）
            const body: any = { inputs, query, response_mode, user }
            if (conversation_id) body.conversation_id = conversation_id

            const response = await fetch(`${baseUrl}/chat-messages`, {
                method: 'POST',
                headers: {
                    'Authorization': apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            })

            const data = await response.json()
            console.log('📨 POST応答（Difyそのまま）:', JSON.stringify(data, null, 2))

            return res.status(response.status).json(data)
        } catch (err) {
            console.error('❌ POSTエラー:', err)
            return res.status(500).json({ error: 'Failed to send chat message' })
        }
    }

    return res.status(405).json({ error: 'Method Not Allowed' })
}
