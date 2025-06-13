// pages/api/proxy/messages.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' })
    }

    const { user, conversation_id } = req.query
    const apiKey = process.env.DIFY_API_KEY

    if (!apiKey || typeof apiKey !== 'string') {
        return res.status(500).json({ error: 'Missing API key in environment' })
    }

    const targetUrl = `https://api.dify.ai/v1/messages?user=${user}&conversation_id=${conversation_id}`

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                Authorization: `${apiKey}`, // Bearerなし
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json()
        console.log('📥 raw API response:', data)

        // 👇 必要な構造に加工して返す
        res.status(200).json({ messages: data.data || [] })
    } catch (error) {
        console.error('❌ Error fetching messages:', error)
        res.status(500).json({ error: 'Failed to fetch messages' })
    }
}
