// /pages/api/proxy/conversations.ts

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' })
    }

    const apiKey = process.env.DIFY_API_KEY
    if (!apiKey) {
        return res.status(500).json({ error: 'Missing API key' })
    }

    const { user } = req.query
    const url = `https://api.dify.ai/v1/conversations?user=${user}`

    const response = await fetch(url, {
        headers: {
            'Authorization': `${apiKey}`  // ✅ Bearer なし
        }
    })

    const data = await response.json()
    if (!response.ok) {
        console.error('❌ Error fetching conversations:', data)
        return res.status(response.status).json(data)
    }

    res.status(200).json(data)
}
