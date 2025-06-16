// pages/api/proxy/conversations.ts

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.DIFY_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Missing API key' })

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.dify.ai/v1'

  if (req.method === 'GET') {
    const { user } = req.query
    if (!user || typeof user !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid user parameter' })
    }

    try {
      const response = await fetch(`${baseUrl}/conversations?user=${encodeURIComponent(user)}`, {
        headers: { Authorization: apiKey }
      })
      const data = await response.json()
      return res.status(response.status).json(data)
    } catch {
      return res.status(500).json({ error: 'Failed to fetch conversations' })
    }
  }

  if (req.method === 'POST') {
    try {
      const response = await fetch(`${baseUrl}/chat-messages`, {
        method: 'POST',
        headers: {
          Authorization: apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      })
      const data = await response.json()
      return res.status(response.status).json(data)
    } catch {
      return res.status(500).json({ error: 'Failed to start conversation' })
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' })
}
