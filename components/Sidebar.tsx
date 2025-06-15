'use client'

import { useEffect, useState } from 'react'

interface Conversation {
    id: string
    name?: string
    updated_at?: number
}

export default function Sidebar({ userId }: { userId: string }) {
    const [conversations, setConversations] = useState<Conversation[]>([])

    useEffect(() => {
        if (!userId) return

        const fetchConversations = async () => {
            try {
                const res = await fetch(`/api/proxy/conversations?user=${userId}&limit=20&sort_by=-updated_at`)
                const data = await res.json()
                if (Array.isArray(data.data)) {
                    setConversations(data.data)
                } else {
                    console.error("⚠️ 会話リスト取得失敗:", data)
                }
            } catch (error) {
                console.error("❌ API取得エラー:", error)
            }
        }

        fetchConversations()
    }, [userId])

    return (
        <div className="w-64 h-screen border-r p-4 overflow-y-auto bg-white">
            <h2 className="text-xl font-bold mb-4">🗂 会話履歴</h2>
            {conversations.map((conv) => (
                <div
                    key={conv.id}
                    className="cursor-pointer px-3 py-2 rounded hover:bg-blue-100 text-sm"
                    onClick={() => {
                        window.location.href = `/chat/${conv.id}?user=${userId}`
                    }}
                >
                    {conv.name || `ID: ${conv.id.slice(0, 8)}...`}
                </div>
            ))}
        </div>
    )
}
