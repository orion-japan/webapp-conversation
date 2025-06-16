'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface SidebarMobileProps {
    userId: string
}

interface Conversation {
    id: string
    name?: string
}

export default function SidebarMobile({ userId }: SidebarMobileProps) {
    const [open, setOpen] = useState(false)
    const [conversations, setConversations] = useState<Conversation[]>([])

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch(`/api/proxy/conversations?user=${userId}`)
                const json = await res.json()
                setConversations(json.data || [])
            } catch (err) {
                console.error('📵 モバイル履歴取得失敗:', err)
            }
        }
        fetchConversations()
    }, [userId])

    return (
        <div className="md:hidden px-4 pt-2">
            <button
                onClick={() => setOpen(!open)}
                className="w-full text-left bg-indigo-100 text-indigo-700 font-semibold py-2 px-3 rounded shadow"
            >
                {open ? '▼ 履歴を閉じる' : '▶ 履歴を開く'}
            </button>

            {open && (
                <div className="mt-2 bg-white rounded shadow-md border border-gray-200 max-h-72 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                        {conversations.map((c) => (
                            <li key={c.id}>
                                <Link
                                    href={`/?user=${userId}&conversation_id=${c.id}`}
                                    className="block px-4 py-2 text-sm hover:bg-indigo-50 truncate"
                                >
                                    {c.name || c.id.slice(0, 10)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
