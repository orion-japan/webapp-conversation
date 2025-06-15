// pages/api/proxy/conversations.ts

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const apiKey = process.env.DIFY_API_KEY?.replace(/^Bearer\s+/i, '')
    if (!apiKey) return res.status(500).json({ error: 'Missing API key' })

    if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' })

    const { user } = req.query
    if (!user || typeof user !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid user parameter' })
    }

    try {
        const response = await fetch(`https://api.dify.ai/v1/conversations?user=${encodeURIComponent(user)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        })

        const data = await response.json()
        return res.status(response.status).json(data)
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch conversations' })
    }
}
