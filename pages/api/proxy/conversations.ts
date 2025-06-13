// conversations.ts（APIキー認証版）

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const apiKey = process.env.DIFY_API_KEY
    if (!apiKey) {
        return res.status(400).json({ error: 'Missing API key in env' })
    }

    const { user } = req.query

    const baseUrl = 'https://api.dify.ai/v1/conversations'
    let url = baseUrl
    let method = 'GET'
    let body = undefined

    switch (req.method) {
        case 'GET':
            url += `?user=${user}`
            break
        case 'DELETE':
        case 'PATCH':
            if (!req.url) return res.status(400).json({ error: 'Invalid URL' })
            const id = req.url.split('/').pop()
            url += `/${id}`
            method = req.method
            if (req.method === 'PATCH') {
                body = JSON.stringify(req.body)
            }
            break
        default:
            return res.status(405).json({ error: 'Method Not Allowed' })
    }

    const response = await fetch(url, {
        method,
        headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json'
        },
        body
    })

    const data = await response.json()
    res.status(response.status).json(data)
}
