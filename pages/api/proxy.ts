// pages/api/proxy.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method, body, query } = req

    const targetUrl = `https://api.dify.ai/${query.path || ''}`

    try {
        const apiRes = await fetch(targetUrl, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.DIFY_API_KEY || ''}`,
            },
            body: method !== 'GET' ? JSON.stringify(body) : undefined,
        })

        const data = await apiRes.json()
        res.status(apiRes.status).json(data)
    } catch (error: any) {
        res.status(500).json({ error: 'Proxy failed', detail: error.message })
    }
}