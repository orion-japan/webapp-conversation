import { useState, useEffect } from 'react'

export default function Home() {
    const [messages, setMessages] = useState<string[]>([])
    const [input, setInput] = useState('')
    const [conversationId, setConversationId] = useState<string | null>(null)
    const [loaded, setLoaded] = useState(false)

    const userId = '669933'

    // ✅ 外部のqueryを受け取る処理（ClickのURLに ?query=〇〇 を含めて呼ぶ）
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const extQuery = params.get('query')
        if (extQuery && !loaded) {
            setInput(extQuery)
            sendMessage(extQuery)
            setLoaded(true) // 一度だけ実行
        }
    }, [loaded])

    const sendMessage = async (text?: string) => {
        const queryText = text ?? input
        if (!queryText.trim()) return

        const res = await fetch('/api/proxy/chat-messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: { text: queryText },
                query: queryText,
                response_mode: 'blocking',
                conversation_id: conversationId,
                user: userId,
            }),
        })

        const data = await res.json()

        setMessages((prev) => [
            ...prev,
            `👤 ${queryText}`,
            `🤖 ${data.answer || '(応答なし)'}`,
        ])

        if (data.conversation_id) {
            setConversationId(data.conversation_id)
        }

        setInput('')
    }

    return (
        <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
            <h1>Hello Sofia ✅</h1>
            {conversationId && (
                <>
                    <p>🧠 会話ID: <strong>{conversationId}</strong></p>
                    <p>👤 ユーザーID: <strong>{userId}</strong></p>
                </>
            )}

            <div style={{ backgroundColor: '#f3f3f3', padding: '1rem', borderRadius: '8px', minHeight: '120px' }}>
                {messages.map((msg, idx) => (
                    <p key={idx}>{msg}</p>
                ))}
            </div>

            <div style={{ marginTop: '1rem' }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ width: '70%' }}
                />
                <button onClick={() => sendMessage()}>送信</button>
            </div>
        </div>
    )
}