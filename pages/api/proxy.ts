import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method, body, query } = req
    const path = query.path as string

    const targetUrl = `https://api.dify.ai/${path}`
    const apiKey = process.env.DIFY_API_KEY

    if (!apiKey) {
        console.error('❌ DIFY_API_KEY が設定されていません')
        return res.status(500).json({ error: 'DIFY_API_KEY not set' })
    }

    try {
        const apiRes = await fetch(targetUrl, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey, // Bearer が含まれている前提
            },
            body: method !== 'GET' ? JSON.stringify(body) : undefined,
        })

        const data = await apiRes.json()

        if (!apiRes.ok) {
            console.error('🔴 Dify API error response:', data)
            return res.status(apiRes.status).json(data)
        }

        return res.status(apiRes.status).json(data)
    } catch (error: any) {
        console.error('🔴 Proxy error:', {
            url: targetUrl,
            method,
            headers: { 'Authorization': apiKey },
            body,
            error: error.message,
        })

        return res.status(500).json({
            error: 'Internal proxy error',
            detail: error.message,
        })
    }
}