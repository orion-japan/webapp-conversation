// app/api/create-session/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const { uid, message } = await req.json()

    const res = await fetch('https://api.dify.ai/v1/chat-messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_APP_KEY}`,
        },
        body: JSON.stringify({
            app_id: process.env.NEXT_PUBLIC_APP_ID,
            user: { user_id: uid },
            inputs: {},
            query: message || 'こんにちは',
        }),
    })

    const text = await res.text()
    try {
        const data = JSON.parse(text)
        return NextResponse.json(data)
    } catch (err) {
        console.error('❌ JSON parse error:', err)
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 500 })
    }
}