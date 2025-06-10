// pages/api/proxy.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req
  const path = query.path as string

  const targetUrl = `https://api.dify.ai/${path}`
  const apiKey = process.env.DIFY_API_KEY

  if (!apiKey) {
    console.error('❌ DIFY_API_KEY が設定されていません')
    return res.status(500).json({ error: 'DIFY_API_KEY is not set' })
  }

  try {
    const apiRes = await fetch(targetUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined
    })

    const data = await apiRes.json()
    res.status(apiRes.status).json(data)
  } catch (err) {
    console.error('API転送エラー:', err)
    res.status(500).json({ error: 'Internal proxy error', detail: (err as any).message })
  }
}