// components/Sidebar.tsx（スマホ対応：モバイル非表示、会話履歴表示）

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface SidebarProps {
    userId: string
}

interface Conversation {
    id: string
    name?: string
}

export default function Sidebar({ userId }: SidebarProps) {
    const [conversations, setConversations] = useState<Conversation[]>([])

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch(`/api/proxy/conversations?user=${userId}`)
                const json = await res.json()
                setConversations(json.data || [])
            } catch (err) {
                console.error('🛑 会話履歴の取得に失敗:', err)
            }
        }

        fetchConversations()
    }, [userId])

    return (
        <div className="h-screen w-64 bg-black text-white overflow-y-auto p-4 hidden md:block">
            <div className="mb-4 font-bold text-xl">💬 会話履歴</div>
            <ul className="space-y-2">
                {conversations.map((c) => (
                    <li key={c.id}>
                        <Link
                            href={`/?user=${userId}&conversation_id=${c.id}`}
                            className="block px-3 py-2 bg-gray-800 rounded hover:bg-gray-700 transition truncate"
                        >
                            {c.name || c.id.slice(0, 10)}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}