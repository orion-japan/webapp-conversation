'use client'

import { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface Message {
    id: string
    role: string
    content: string
    created_at?: number
}

export default function Home() {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [conversationId, setConversationId] = useState<string | null>(null)
    const [userId, setUserId] = useState<string>('unknown')
    const userIdRef = useRef<string>('unknown')
    const [conversations, setConversations] = useState<any[]>([])
    const [selectedConversation, setSelectedConversation] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [pendingMessage, setPendingMessage] = useState<Message | null>(null)
    const [initialScroll, setInitialScroll] = useState(true)
    const [fadeKey, setFadeKey] = useState(0)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const uid = urlParams.get('user') || 'unknown'
        setUserId(uid)
        userIdRef.current = uid

        const fetchConversations = async () => {
            const res = await fetch(`/api/proxy/conversations?user=${uid}`)
            const data = await res.json()
            setConversations(data.data || [])
        }
        fetchConversations()
    }, [])

    useEffect(() => {
        if (!selectedConversation) return
        setPendingMessage(null)
        setConversationId(selectedConversation)
        setInitialScroll(true)
        setFadeKey(prev => prev + 1)  // ✅ フェードアニメ切り替え用にキー変更
    }, [selectedConversation])

    useEffect(() => {
        if (!conversationId) return
        const uid = userIdRef.current
        const fetchMessages = async () => {
            console.log('🔍 conversationId:', conversationId)
            console.log('🔍 userId (ref):', uid)
            const res = await fetch(`/api/proxy/messages?user=${encodeURIComponent(uid)}&conversation_id=${encodeURIComponent(conversationId)}`)
            const data = await res.json()
            setMessages(data.messages || [])  // ✅ クリアしてから上書き
        }
        fetchMessages()
    }, [conversationId])

    useEffect(() => {
        if (initialScroll) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
            setInitialScroll(false)
        } else {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    const handleSend = async (query: string) => {
        if (!query) return
        const newMessage: Message = {
            id: uuidv4(),
            role: 'user',
            content: query
        }
        setMessages((prev) => [...prev, newMessage])
        setPendingMessage(newMessage)
        setInput('')

        const payload = {
            inputs: {},
            query,
            response_mode: 'blocking',
            conversation_id: conversationId,
            user: userIdRef.current
        }

        const res = await fetch('/api/proxy/chat-messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })

        const data = await res.json()
        if (data.conversation_id) {
            setTimeout(() => {
                setConversationId(data.conversation_id)
                setSelectedConversation(data.conversation_id)
            }, 300)
        }

        if (!data.answer) return

        const aiMessage: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: data.answer
        }
        setMessages((prev) => [...prev, aiMessage])
    }

    const handleNewConversation = () => {
        setMessages([])
        setConversationId(null)
        setSelectedConversation('')
    }

    const handleDelete = async (id: string) => {
        const ok = confirm("この会話を削除しますか？")
        if (!ok) return
        await fetch(`/api/proxy/conversations/${id}`, { method: 'DELETE' })
        setConversations((prev) => prev.filter((c) => c.id !== id))
        if (id === selectedConversation) {
            setSelectedConversation('')
            setConversationId(null)
            setMessages([])
        }
    }

    const handleRename = async (id: string) => {
        const newName = prompt("新しい会話名を入力してください")
        if (!newName) return
        await fetch(`/api/proxy/conversations/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        })
        setConversations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, name: newName } : c))
        )
    }

    return (
        <div className="flex h-screen w-full overflow-hidden font-serif bg-gradient-to-b from-indigo-50 to-purple-50">
            <button className="absolute top-2 left-2 z-10 lg:hidden bg-white/70 px-3 py-1 rounded" onClick={() => setSidebarOpen(!sidebarOpen)}>
                ☰
            </button>

            <div className={`fixed lg:static top-0 left-0 h-full w-64 bg-white/80 shadow-lg p-4 overflow-y-auto transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <button onClick={handleNewConversation} className="mb-4 w-full bg-indigo-500 text-white py-2 rounded">＋ 新しい会話</button>
                {conversations.map((conv) => (
                    <div key={conv.id} className="group flex items-center justify-between px-2 py-1 rounded hover:bg-indigo-100">
                        <span
                            onClick={() => setSelectedConversation(conv.id)}
                            className={conv.id === selectedConversation ? 'flex-1 cursor-pointer truncate bg-indigo-200' : 'flex-1 cursor-pointer truncate'}
                        >
                            {conv.name || conv.id.slice(0, 10)}
                        </span>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleRename(conv.id)} className="text-sm hover:text-indigo-700">✏️</button>
                            <button onClick={() => handleDelete(conv.id)} className="text-sm hover:text-red-500">🗑</button>
                        </div>
                    </div>
                ))}
            </div>

            <div key={fadeKey} className="flex-1 flex flex-col h-full items-center transition-opacity duration-500 opacity-100">
                <div className="flex-1 w-full max-w-3xl overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={msg.role === 'user' ? 'w-full flex justify-end' : 'w-full flex justify-start'}>
                            <div className={msg.role === 'user' ? 'max-w-xl p-4 rounded-xl shadow-md bg-white whitespace-pre-line leading-relaxed' : 'max-w-xl p-4 rounded-xl shadow-md bg-indigo-100 whitespace-pre-line leading-relaxed'}>
                                {msg.content || '(No answer)'}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="w-full max-w-3xl p-4 border-t bg-white/70 backdrop-blur flex">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend(input)}
                        className="flex-1 border rounded px-4 py-4 text-lg shadow-inner bg-white/90 resize-none h-28"
                        placeholder="あなたの内なる響きを言葉にしてください..."
                    />
                    <button onClick={() => handleSend(input)} className="ml-2 px-6 py-4 bg-indigo-500 text-white rounded shadow text-lg">
                        響かせる
                    </button>
                </div>
            </div>
        </div>
    )
}