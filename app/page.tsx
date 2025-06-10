'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [uid, setUid] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [started, setStarted] = useState(false)

  // URL から uid を取得
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const uidFromURL = params.get('uid')
    if (uidFromURL) {
      setUid(uidFromURL)
      console.log('✅ UID:', uidFromURL)
    }
  }, [])

  // 外部からの postMessage 受信（Click 連携用）
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'dify_response') {
        setResponse(event.data.content)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // スタートボタンを押したときの処理
  const startConversation = async () => {
    if (!uid) {
      console.error('❌ UIDが存在しません')
      return
    }

    console.log('🚀 スタートボタンが押されました')
    try {
      const res = await fetch('/api/create-session', {
        method: 'POST',
        body: JSON.stringify({ uid }),
      })

      if (!res.ok) {
        const text = await res.text()
        console.error('❌ セッション作成失敗:', res.status, text)
        return
      }

      const data = await res.json()
      setConversationId(data.conversation_id)
      setStarted(true)
      console.log('✅ セッション開始:', data.conversation_id)
    } catch (error) {
      console.error('❌ エラー:', error)
    }
  }

  // 入力送信
  const sendMessage = async () => {
    if (!conversationId || !uid) {
      console.warn('⚠️ セッションまたはUIDが未定義です')
      return
    }

    const res = await fetch('/api/chat-messages', {
      method: 'POST',
      body: JSON.stringify({ query: input, conversation_id: conversationId, uid }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('❌ メッセージ送信失敗:', res.status, text)
      return
    }

    const data = await res.json()
    setResponse(data.answer)
    setInput('')
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      {!started ? (
        <button onClick={startConversation} style={{ fontSize: '1.2rem' }}>
          🚀 スタート
        </button>
      ) : (
        <>
          <h1>Sofia Chat App</h1>
          <div>
            <strong>レスポンス:</strong>
            <div style={{ margin: '1rem 0', background: '#f2f2f2', padding: '1rem', borderRadius: '8px' }}>
              {response || '(no response)'}
            </div>
            <input
              type="text"
              placeholder="Sofiaに話しかけてください"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ width: '70%', padding: '0.5rem', fontSize: '1rem' }}
            />
            <button onClick={sendMessage} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
              送信
            </button>
          </div>
        </>
      )}
    </main>
  )
}