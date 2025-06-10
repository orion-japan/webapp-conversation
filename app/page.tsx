'use client'

import { useState } from 'react'

export default function Page() {
  const [userInput, setUserInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const startConversation = async () => {
    if (!userInput.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/proxy?path=v1/chat-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: { text: userInput },
          user: 'uid-demo', // 必要に応じてClickから受け取ったUIDに変更
          conversation_id: null
        })
      })
      const data = await res.json()
      setResponse(data.answer || JSON.stringify(data))
    } catch (err) {
      console.error('Error:', err)
      setResponse('エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Sofiaと会話する</h1>
      <div className="flex gap-2">
        <input
          type="text"
          className="border p-2 rounded w-64"
          placeholder="メッセージを入力"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={startConversation}
          disabled={loading}
        >
          {loading ? '送信中...' : 'スタート'}
        </button>
      </div>
      <div className="mt-6 w-full max-w-xl bg-white p-4 shadow rounded">
        <h2 className="font-semibold text-gray-700 mb-2">Sofiaの返答：</h2>
        <p className="text-gray-800 whitespace-pre-line">{response}</p>
      </div>
    </div>
  )
}
