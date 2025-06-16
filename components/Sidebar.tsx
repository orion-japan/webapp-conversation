
'use client'

import { useEffect, useState } from 'react'

interface SidebarProps {
    userId: string
    onStartNewConversation: () => void
}

export default function Sidebar({ userId, onStartNewConversation }: SidebarProps) {
    const [conversations, setConversations] = useState<any[]>([])

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch(`/api/proxy/conversations?user=${userId}&limit=20&sort_by=-updated_at`)
                const data = await res.json()
                if (Array.isArray(data.data)) {
                    setConversations(data.data)
                }
            } catch (err) {
                console.error('💥 会話履歴取得失敗:', err)
            }
        }

        fetchConversations()
    }, [userId])

    const handleSelectConversation = (id: string) => {
        const url = new URL(window.location.href)
        url.searchParams.set('conversation_id', id)
        window.location.href = url.toString()
    }

    const handleNewConversation = () => {
        const url = new URL(window.location.href)
        url.searchParams.delete('conversation_id')
        window.history.pushState({}, '', url.toString())
        onStartNewConversation()
    }

    return (
        <div className="w-64 bg-black text-white p-4 overflow-y-auto">
            <button
                onClick={handleNewConversation}
                className="bg-white text-black px-4 py-2 rounded mb-4 hover:bg-gray-200 w-full"
            >
                + 新しい会話
            </button>
            <div className="space-y-2">
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv.id)}
                        className="cursor-pointer p-2 bg-gray-800 rounded hover:bg-gray-700"
                    >
                        {conv.name || '会話開始'}
                    </div>
                ))}
            </div>
        </div>
    )
}
