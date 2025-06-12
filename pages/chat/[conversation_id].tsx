// pages/chat/[conversation_id].tsx
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const mockConversations = [
    { id: 'abc123', title: '朝の瞑想', created_at: '2025-06-12T08:00' },
    { id: 'def456', title: '夜の対話', created_at: '2025-06-11T22:15' },
];

export default function ChatPage() {
    const router = useRouter();
    const { conversation_id } = router.query;
    const [currentId, setCurrentId] = useState(conversation_id);

    useEffect(() => {
        if (conversation_id) setCurrentId(conversation_id);
    }, [conversation_id]);

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* 履歴パネル */}
            <div className="md:w-1/4 w-full bg-gray-100 p-4 border-b md:border-b-0 md:border-r">
                <h2 className="text-lg font-semibold mb-4">🗂 会話履歴</h2>
                {mockConversations.map((conv) => (
                    <button
                        key={conv.id}
                        onClick={() => router.push(`/chat/${conv.id}`)}
                        className={`block w-full text-left px-3 py-2 mb-2 rounded ${conv.id === currentId ? 'bg-blue-200' : 'hover:bg-gray-200'
                            }`}
                    >
                        {conv.title}
                    </button>
                ))}
            </div>

            {/* チャットエリア（中央寄せ） */}
            <div className="md:w-3/4 w-full p-6 flex flex-col items-center">
                <div className="w-full max-w-xl">
                    <h1 className="text-2xl font-bold mb-4">Hello Sofia ✅</h1>

                    <div className="border rounded p-4 mb-4 bg-white min-h-[200px]">
                        <p>ここに選択中の会話（{currentId}）のメッセージが表示されます。</p>
                    </div>

                    <div className="flex">
                        <input
                            type="text"
                            placeholder="メッセージを入力..."
                            className="flex-grow px-4 py-2 border rounded-l"
                        />
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-r">送信</button>
                    </div>
                </div>
            </div>
        </div>
    );
}