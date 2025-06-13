// pages/api/proxy/history.ts

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' })
    }

    const apiKey = process.env.DIFY_API_KEY
    if (!apiKey) {
        return res.status(500).json({ error: 'Missing API key' })
    }

    const { user, conversation_id } = req.query

    if (!user || !conversation_id) {
        return res.status(400).json({ error: 'Missing user or conversation_id' })
    }

    try {
        const response = await fetch(`https://api.dify.ai/v1/messages?user=${user}&conversation_id=${conversation_id}`, {
            headers: {
                Authorization: `${apiKey}`, // ✅ Bearerは.env.localに含まれている前提
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json()
        res.status(response.status).json(data)
    } catch (err: any) {
        res.status(500).json({
            error: 'Failed to fetch messages',
            details: err.message || String(err),
        })
    }
}
