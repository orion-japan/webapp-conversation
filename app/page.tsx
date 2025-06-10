'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [started, setStarted] = useState(false)
  const [uid, setUid] = useState('')
  const [conversationId, setConversationId] = useState('')
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')

  // URLから uid を取得
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const uidFromUrl = params.get('uid')
    if (uidFromUrl) setUid(uidFromUrl)
  }, [])

  // ✅ スタートボタンでセッション開始
  const startConversation = async () => {
    const res = await fetch('/api/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid }),
    })

    const data = await res.json()
    if (data?.id) {
      setConversationId(data.id)
      setStarted(true)
    } else {
      alert('セッション開始に失敗しました')
      console.error(data)
    }
  }

  // ✅ iframe からの postMessage を受信
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'dify_response') {
        setResponse(event.data.content)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      {!started ? (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h2>🪐 Sofia Resonance Chat</h2>
          <p style={{ marginBottom: '1rem' }}>はじめての方はこちらから</p>
          <button
            onClick={startConversation}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.2rem',
              borderRadius: '8px',
              background: '#333',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            🌱 スタート
          </button>
        </div>
      ) : (
        <div>
          <iframe
            src={`https://api.dify.ai/chat/${process.env.NEXT_PUBLIC_APP_ID}?conversation_id=${conversationId}&uid=${uid}`}
            style={{ width: '100%', height: '600px', border: 'none', marginTop: '2rem' }}
          />
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5' }}>
            <h4>🌀 Sofiaの返答（preview）:</h4>
            <div>{response}</div>
          </div>
        </div>
      )}
    </main>
  )
}