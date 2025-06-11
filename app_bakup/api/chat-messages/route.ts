// app/api/create-session/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json()
    console.log('✅ API受信: uid =', uid)

    if (!uid) {
      return NextResponse.json(
        { error: 'UIDが空です。' },
        { status: 400 }
      )
    }

    const res = await fetch('https://api.dify.ai/v1/chat-sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_APP_KEY || ''}`,
      },
      body: JSON.stringify({
        user: { user_id: uid },
      }),
    })

    const text = await res.text()

    console.log('🔁 Dify応答文字列:', text)

    let data: any
    try {
      data = JSON.parse(text)
    } catch (jsonErr) {
      console.error('⚠️ JSONパース失敗:', jsonErr)
      return NextResponse.json(
        { error: 'JSONパース失敗', raw: text },
        { status: 500 }
      )
    }

    if (!res.ok) {
      console.error('❌ Difyエラー:', data)
      return NextResponse.json({ error: 'Dify API error', detail: data }, { status: res.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('🔥 route.ts内エラー:', error)
    return NextResponse.json(
      { error: '内部エラー', detail: String(error) },
      { status: 500 }
    )
  }
}
