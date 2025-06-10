// pages/api/proxy.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method, body, query } = req

    const path = typeof query.path === 'string' ? query.path : ''
    const targetUrl = `https://api.dify.ai/${path}`
    const apiKey = process.env.DIFY_API_KEY

    console.log('[DEBUG] targetUrl:', targetUrl)
    console.log('[DEBUG] DIFY_API_KEY:', apiKey)

    if (!apiKey) {
        console.error('❌ DIFY_API_KEY is missing')
        return res.status(500).json({ error: 'Missing API Key' })
    }

    try {
        const apiRes = await fetch(targetUrl, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: method !== 'GET' ? JSON.stringify(body) : undefined,
        })

        const data = await apiRes.json()
        res.status(apiRes.status).json(data)
    } catch (err: any) {
        console.error('❌ Proxy fetch error:', err.message)
        res.status(500).json({ error: 'Proxy server error', detail: err.message })
    }
}

console.log('🔑 API KEY =', process.env.DIFY_API_KEY); // これ追加
