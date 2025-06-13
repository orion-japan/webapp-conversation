import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' })
    }

    const { user, conversation_id } = req.query
    const apiKey = process.env.DIFY_API_KEY
    const apiBaseUrl = process.env.DIFY_API_BASE_URL || 'https://api.dify.ai/v1'

    if (!apiKey) {
        return res.status(500).json({ error: 'Missing API key' })
    }

    try {
        const url = `${apiBaseUrl}/messages?user=${user}&conversation_id=${conversation_id}`
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${apiKey}` // ✅ Bearer を付加しない
            }
        })

        const data = await response.json()

        if (!response.ok) {
            return res.status(response.status).json({ error: data })
        }

        return res.status(200).json(data)
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
}
