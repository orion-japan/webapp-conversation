'use client'

import { useState, useEffect } from 'react'

export default function Page() {
  const [userInput, setUserInput] = useState('')
  const [response, setResponse] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [uid, setUid] = useState<string | null>(null)
  const [started, setStarted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let uidFromUrl = new URLSearchParams(window.location.search).get('uid');
    if (!uidFromUrl) {
      const match = document.cookie.match(/(?:^|;\s*)dify_user_id=([^;]*)/);
      if (match) {
        uidFromUrl = match[1];
      }
    }
    if (uidFromUrl) {
      console.log('UID取得成功:', uidFromUrl);
      setUid(uidFromUrl);
    } else {
      console.warn('UIDが取得できませんでした');
    }

    const handler = (event: MessageEvent) => {
      if (event.data?.uid) {
        console.log('postMessageでUID受信:', event.data.uid);
        setUid(event.data.uid);
      }
    }
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const startSession = async () => {
    console.log('STARTボタン押下: UID =', uid);
    if (!uid) {
      alert('UIDが見つかりません');
      return;
    }
    setLoading(true)
    try {
      const res = await fetch('/api/proxy?path=v1/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: uid })
      })
      const data = await res.json()
      console.log('conversation_id:', data.id);
      setConversationId(data.id)
      setStarted(true)
      window.parent.postMessage({ uid, conversation_id: data.id }, '*')

      // 自動送信（テスト）
      await sendMessage('こんにちは', data.id)
    } catch (err) {
      console.error('セッション開始失敗:', err)
      alert('セッション開始に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (message: string, convId: string) => {
    console.log('メッセージ送信:', message);
    try {
      const res = await fetch('/api/proxy?path=v1/chat-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: message,
          user: uid,
          conversation_id: convId,
          response_mode: 'blocking',
          inputs: {}
        })
      })
      const data = await res.json()
      console.log('応答データ:', data);
      setResponse(data.answer || data.message || JSON.stringify(data))
      window.parent.postMessage({ content: data.answer }, '*')
    } catch (err) {
      console.error('送信エラー:', err)
      setResponse('エラーが発生しました')
    }
  }

  const startConversation = async () => {
    if (!userInput.trim() || !conversationId || !uid) return
    setLoading(true)
    await sendMessage(userInput, conversationId)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Sofiaと会話する</h1>

      <div className="text-sm text-gray-500 mb-2">現在のUID: {uid || '未取得'}</div>

      {!started ? (
        <button
          className="bg-purple-600 text-white px-6 py-2 rounded mb-4"
          onClick={startSession}
          disabled={loading}
        >
          {loading ? '読み込み中...' : 'START'}
        </button>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}