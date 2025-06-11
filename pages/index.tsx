import { useState, useEffect } from 'react'

export default function Home() {
    const [messages, setMessages] = useState<string[]>([])
    const [input, setInput] = useState('')
    const [conversationId, setConversationId] = useState<string | null>(null)

    // Clickから外部変数を受け取る方法（例：URLやグローバル変数から）
    const userId = '669933'
    const externalQuery = (window as any).query || '' // ← Clickから受け取った入力

    useEffect(() => {
        if (externalQuery) {
            setInput(externalQuery)
            sendMessage(externalQuery)
        }
    }, [externalQuery])

    const sendMessage = async (queryText?: string) => {
        const text = queryText ?? input
        if (!text.trim()) return

        const res = await fetch('/api/proxy/chat-messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: { text },
                query: text,
                response_mode: 'blocking',
                conversation_id: conversationId,
                user: userId,
            }),
        })

        const data = await res.json()
        console.log('🎯 response', data)

        setMessages((prev) => [
            ...prev,
            `👤 ${text}`,
            `🤖 ${data.answer || '(応答なし)'}`,
        ])

        if (data.conversation_id) {
            setConversationId(data.conversation_id)
        }

        setInput('')
    }

    return (
        <div style={{ padding: '1rem' }}>
            <h1>Hello Sofia ✅</h1>

            {conversationId && (
                <>
                    <p>🧠 会話ID: <strong>{conversationId}</strong></p>
                    <p>👤 ユーザーID: <strong>{userId}</strong></p>
                </>
            )}

            {messages.map((m, i) => (
                <p key={i}>{m}</p>
            ))}

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ width: '80%' }}
            />
            <button onClick={() => sendMessage()}>送信</button>
        </div>
    )
}