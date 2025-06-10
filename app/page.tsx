'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [uid, setUid] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [started, setStarted] = useState(false)

  // uid 取得
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const uidParam = urlParams.get('uid')
    if (uidParam) setUid(uidParam)
  }, [])

  // Difyからのレスポンスを受け取る
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'dify_response') {
        setResponse(event.data.content)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // スタート（初回のみ表示）
  const handleStart = async () => {
    if (!uid) return
    const res = await fetch('/api/create-session', {
      method: 'POST',
      body: JSON.stringify({ uid }),
    })
    const data = await res.json()
    setConversationId(data.conversation_id)
    setStarted(true)
  }

  // 新規会話（何度でも押せる）
  const handleNewConversation = async () => {
    if (!uid) return
    const res = await fetch('/api/create-session', {
      method: 'POST',
      body: JSON.stringify({ uid }),
    })
    const data = await res.json()
    setConversationId(data.conversation_id)
    setResponse('')
  }

  return (
    <main style={{ padding: 20 }}>
      {!started ? (
        <button onClick={handleStart}>🚀 スタート</button>
      ) : (
        <>
          <button onClick={handleNewConversation} style={{ marginBottom: 10 }}>
            🆕 新規会話をはじめる
          </button>

          <iframe
            src="https://muverse.jp/iframe-placeholder" // ← 表示用iframe
            width="100%"
            height="300"
            style={{ border: '1px solid #ccc', marginBottom: 10 }}
          ></iframe>

          <div style={{ marginTop: 10 }}>
            <strong>返答:</strong>
            <div>{response}</div>
          </div>
        </>
      )}
    </main>
  )
}