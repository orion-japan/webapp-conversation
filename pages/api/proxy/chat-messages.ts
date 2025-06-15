
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
            const response = await fetch(`${baseUrl}/chat-messages`, {
                method: 'POST',
                headers: {
                    'Authorization': apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputs, query, response_mode, user, conversation_id })
            })

            const data = await response.json()
            console.log('📨 POST応答（Difyそのまま）:', JSON.stringify(data, null, 2))

            return res.status(200).json(data)
        } catch (err) {
            console.error('❌ POSTエラー:', err)
            return res.status(500).json({ error: 'Failed to send chat message' })
        }
    }

    return res.status(405).json({ error: 'Method Not Allowed' })
}
