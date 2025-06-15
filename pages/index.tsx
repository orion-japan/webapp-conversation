
'use client'

import { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface Message {
    id: string
    role?: string
    content: string
    question?: string
    answer?: string
    created_at?: number
}

export default function Home() {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [conversationId, setConversationId] = useState<string | null>(null)
    const [userId, setUserId] = useState<string>('unknown')
    const [conversations, setConversations] = useState<any[]>([])
    const [selectedConversation, setSelectedConversation] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const uid = new URLSearchParams(window.location.search).get('user') || 'unknown'
        setUserId(uid)
        fetch(`/api/proxy/conversations?user=${uid}`)
            .then(res => res.json())
            .then(data => {
                setConversations(data.data || [])
                if (data.data?.length > 0) {
                    const latest = data.data[0]
                    setConversationId(latest.id)
                    setSelectedConversation(latest.id)
                }
            })
    }, [])

    useEffect(() => {
        if (!conversationId) return
        fetch(`/api/proxy/messages?user=${userId}&conversation_id=${conversationId}`)
            .then(res => res.json())
            .then(data => {
                if (data?.messages) {
                    setMessages(data.messages)
                }
            })
    }, [conversationId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async (query: string) => {
        if (!query.trim()) return
        const userMessage: Message = {
            id: uuidv4(),
            role: 'user',
            content: query,
            question: query,
        }
        setMessages((prev) => [...prev, userMessage])
        setInput('')

        const payload = {
            inputs: {},
            query,
            response_mode: 'blocking',
            conversation_id: conversationId,
            user: userId
        }

        const res = await fetch('/api/proxy/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (data.conversation_id) {
            setConversationId(data.conversation_id)
            setSelectedConversation(data.conversation_id)
        }

        const assistantMessage: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: data.answer,
            answer: data.answer
        }
        setMessages((prev) => [...prev, assistantMessage])
    }

    const handleNewConversation = () => {
        setMessages([])
        setConversationId(null)
        setSelectedConversation('')
    }

    return (
        <div className="flex h-screen w-full overflow-hidden font-serif bg-gradient-to-b from-indigo-50 to-purple-50">
            <button className="absolute top-2 left-2 z-10 lg:hidden bg-white/70 px-3 py-1 rounded" onClick={() => setSidebarOpen(!sidebarOpen)}>
                ☰
            </button>

            <div className={`fixed lg:static top-0 left-0 h-full w-64 bg-black text-white shadow-lg p-4 overflow-y-auto transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <button onClick={handleNewConversation} className="mb-4 w-full bg-white text-black py-2 rounded">＋ 新しい会話</button>
                {conversations.map((conv) => (
                    <div key={conv.id} className="group flex items-center justify-between px-2 py-1 rounded hover:bg-gray-800">
                        <span
                            onClick={() => {
                                setConversationId(conv.id)
                                setSelectedConversation(conv.id)
                            }}
                            className={conv.id === selectedConversation ? 'flex-1 cursor-pointer truncate text-yellow-400' : 'flex-1 cursor-pointer truncate'}>
                            {conv.name || conv.id.slice(0, 10)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex-1 flex flex-col h-full items-center">
                <div className="flex-1 w-full max-w-4xl overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => {
                        const role = (msg.role || '').toLowerCase()
                        const isUser = role === 'user' || (!!msg.question && !msg.answer)
                        return (
                            <div key={msg.id} className={isUser ? 'w-full flex justify-end' : 'w-full flex justify-start'}>
                                <div className={`p-4 max-w-xl rounded-xl shadow-message border ${isUser ? 'ml-auto bg-sofia text-black border-sofia' : 'mr-auto bg-pink-100 text-black'}`} style={{ whiteSpace: 'pre-wrap' }}>
                                    {msg.content || msg.question || msg.answer || '(No content)'}
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="w-full max-w-4xl p-4 border-t bg-white/90 backdrop-blur flex">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend(input)}
                        className="flex-1 border rounded px-4 py-4 text-lg shadow-inner bg-white resize-none h-28"
                        placeholder="メッセージを入力..."
                    />
                    <button onClick={() => handleSend(input)} className="ml-2 px-6 py-4 bg-black text-white rounded shadow text-lg">
                        送信
                    </button>
                </div>
            </div>
        </div>
    )
}
