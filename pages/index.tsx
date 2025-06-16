// pages/index.tsx（スマホ幅拡張＆アイコン上配置対応済み）

'use client'

import { useSearchParams } from 'next/navigation'
import Sidebar from '../components/Sidebar'
import SidebarMobile from '../components/SidebarMobile'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface Message {
    id: string
    role: string
    answer: string
    question?: string
}

export default function Home() {
    const searchParams = useSearchParams()
    const userId = searchParams.get('user')
    if (!userId) {
        return (
            <div className="flex h-screen items-center justify-center text-center text-red-600 p-6">
                🚫 URLに <code>?user=あなたのID</code> を付けてアクセスしてください。
            </div>
        )
    }

    return <ChatPage userId={userId} />
}

function ChatPage({ userId }: { userId: string }) {
    const searchParams = useSearchParams()
    const conversationId = searchParams.get('conversation_id')
    const preset = searchParams.get('preset')

    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (preset) {
            setInput(preset)
        }
    }, [preset])

    useEffect(() => {
        const fetchMessages = async () => {
            if (!conversationId) return
            try {
                const res = await fetch(`/api/proxy/messages?user=${userId}&conversation_id=${conversationId}`)
                const data = await res.json()
                if (Array.isArray(data.data)) {
                    const formatted = data.data.flatMap((msg: any) => [
                        {
                            id: msg.id + '-user',
                            role: 'user',
                            answer: msg.query || '(No input)',
                        },
                        {
                            id: msg.id + '-ai',
                            role: 'assistant',
                            answer: msg.answer || msg.content || msg.message || '(No answer)',
                        },
                    ])
                    setMessages(formatted)
                }
            } catch (err) {
                console.error('💥 メッセージ取得失敗:', err)
            }
        }

        fetchMessages()
    }, [conversationId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            question: input,
            answer: input,
        }
        setMessages((prev) => [...prev, userMessage])

        try {
            const payload = {
                user: userId,
                conversation_id: conversationId,
                query: input,
                inputs: {},
                response_mode: 'blocking',
                name: conversationId ? undefined : '新しいチャット',
            }

            const res = await fetch('/api/proxy/chat-messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            const data = await res.json()
            const assistantMessage = {
                id: data.id || crypto.randomUUID(),
                role: 'assistant',
                question: input,
                answer: data.answer || data.message || '(No answer)',
            }
            setMessages((prev) => [...prev, assistantMessage])
            setInput('')
        } catch (err) {
            console.error('💥 送信失敗:', err)
        }
    }

    return (
        <div className="flex h-screen flex-col">
            <SidebarMobile userId={userId} />
            <div className="flex flex-1">
                <div className="hidden md:block">
                    <Sidebar userId={userId} />
                </div>
                <div className="flex flex-col flex-1 bg-gradient-to-b from-purple-50 to-indigo-100 p-4 w-full">
                    <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`mb-4 flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="mb-1">
                                        <Image src="/Sofia_logo.png" alt="Sofia" width={40} height={40} className="mx-auto" />
                                    </div>
                                )}
                                <div
                                    className={`px-4 py-2 rounded-xl whitespace-pre-wrap shadow-sm w-full max-w-full sm:max-w-[100%] ${msg.role === 'user'
                                        ? 'bg-pink-200 text-gray-800 text-right' : 'bg-white border border-gray-300 text-gray-700'
                                        }`}
                                >
                                    {msg.answer}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="flex justify-center mt-4 px-2">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="メッセージを入力..."
                            className="w-full max-w-3xl p-3 rounded-l-xl border border-gray-300 resize-none text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 min-h-[6rem]"
                            rows={4}
                        />
                        <button
                            onClick={handleSend}
                            className="bg-purple-400 hover:bg-purple-500 text-white px-6 rounded-r-xl transition"
                        >
                            送信
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}