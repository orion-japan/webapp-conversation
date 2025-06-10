// app/page.tsx（チャットUI実装版）
'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [sessionId, setSessionId] = useState('')
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  // 初回セッション作成
  useEffect(() => {
    const createSession = async () => {
      const uid = new URLSearchParams(window.location.search).get('uid') || 'guest'
      const res = await fetch('/api/create-session', {
        method: 'POST',
        body: JSON.stringify({ uid }),
      })
      const data = await res.json()
      if (data?.id) setSessionId(data.id)
    }
    createSession()
  }, [])

  // メッセージ送信
  const sendMessage = async () => {
    if (!input.trim()) return
    const newMsg = { role: 'user', content: input }
    setMessages((prev) => [...prev, newMsg])
    setInput('')
    setLoading(true)

    const res = await fetch('/api/chat-messages', {
      method: 'POST',
      body: JSON.stringify({ message: input, sessionId }),
    })
    const data = await res.json()
    const reply = { role: 'assistant', content: data.answer || '(no response)' }
    setMessages((prev) => [...prev, reply])
    setLoading(false)
  }

  return (
    <main className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Sofia Chat App</h1>

      <div className="space-y-2 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <span className="inline-block px-3 py-2 rounded bg-gray-100 dark:bg-gray-800">
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <div className="italic">Sofiaが考え中です...</div>}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border px-3 py-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Sofiaに話しかけてみてください"
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={sendMessage}
          disabled={loading}
        >
          送信
        </button>
      </div>
    </main>
  )
}