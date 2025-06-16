import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const apiKey = process.env.DIFY_API_KEY
    const baseUrl = 'https://api.dify.ai/v1'

    if (!apiKey || !apiKey.startsWith('Bearer ')) {
        return res.status(500).json({ error: 'Invalid or missing API key' })
    }

    if (req.method === 'GET') {
        const { user, conversation_id } = req.query

        if (!user || typeof user !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid user parameter' })
        }

        if (!conversation_id || typeof conversation_id !== 'string') {
            // 👇 conversation_idがない場合はレスポンスを返さず終了（これがポイント）
            return
        }

        const url = `${baseUrl}/messages?user=${encodeURIComponent(user)}&conversation_id=${encodeURIComponent(conversation_id)}`
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': apiKey
                },
            })

            const data = await response.json()
            return res.status(response.status).json(data)
        } catch (err) {
            console.error('❌ messages.ts fetch error:', err)
            return res.status(500).json({ error: 'Failed to fetch messages' })
        }
    }

    return res.status(405).json({ error: 'Method Not Allowed' })
}
