import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method, body, query } = req
    const path = query.path as string
    const targetUrl = `https://api.dify.ai/${path}`
    const apiKey = process.env.DIFY_API_KEY

    if (!apiKey) {
        console.error('❌ DIFY_API_KEY が未設定です')
        return res.status(500).json({ error: 'DIFY_API_KEY is not set' })
    }

    try {
        const payload = {
            inputs: body.inputs || {},
            query: body.query || '',
            response_mode: body.response_mode || 'blocking',
            conversation_id: body.conversation_id || undefined,
            user: body.user || undefined
        }

        const apiRes = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey
            },
            body: JSON.stringify(payload)
        })

        const data = await apiRes.json()

        if (!apiRes.ok) {
            console.error('🔴 Dify API error:', data)
            return res.status(apiRes.status).json(data)
        }

        return res.status(apiRes.status).json(data)

    } catch (error: any) {
        console.error('🔴 Proxy error:', {
            url: targetUrl,
            method,
            body,
            error: error.message,
        })

        return res.status(500).json({
            error: 'Internal proxy error',
            detail: error.message
        })
    }
}