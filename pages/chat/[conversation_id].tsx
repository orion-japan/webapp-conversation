// pages/chat/[conversation_id].tsx
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const mockConversations = [
    { id: 'abc123', title: '朝の瞑想', created_at: '2025-06-12T08:00' },
    { id: 'def456', title: '夜の対話', created_at: '2025-06-11T22:15' },
];

const API_URL = 'https://api.dify.ai/v1/chat-messages';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

export default function ChatPage() {
    const router = useRouter();
    const { conversation_id } = router.query;
    const [currentId, setCurrentId] = useState(conversation_id);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (conversation_id) setCurrentId(conversation_id);
    }, [conversation_id]);

    const handleSend = async () => {
        if (!message.trim()) return;
        setMessages((prev) => [...prev, `わたし: ${message}`]);
        setLoading(true);

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: {},
                    query: message,
                    response_mode: 'blocking',
                    conversation_id: currentId,
                    user: 'sofia-user'
                })
            });

            const data = await res.json();
            if (data.answer) {
                setMessages((prev) => [...prev, `Sofia: ${data.answer}`]);
            } else {
                setMessages((prev) => [...prev, 'Sofia: 応答が取得できませんでした。']);
            }
        } catch (err) {
            console.error('送信エラー:', err);
            setMessages((prev) => [...prev, 'Sofia: エラーが発生しました。']);
        } finally {
            setLoading(false);
            setMessage("");
        }
    };

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

            {/* チャットエリア */}
            <div className="md:w-3/4 w-full p-6 flex justify-center items-start">
                <div className="w-full max-w-xl">
                    <h1 className="text-2xl font-bold mb-4">Hello Sofia ✅</h1>

                    <div className="border rounded p-4 mb-4 bg-white min-h-[200px]">
                        {messages.length === 0 ? (
                            <p>ここに選択中の会話（{currentId}）のメッセージが表示されます。</p>
                        ) : (
                            <ul className="space-y-2">
                                {messages.map((msg, index) => (
                                    <li key={index} className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">
                                        {msg}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {loading && <p className="text-sm text-gray-500 mt-2">Sofiaが考え中です…</p>}
                    </div>

                    <div className="flex">
                        <input
                            type="text"
                            placeholder="メッセージを入力..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-grow px-4 py-2 border rounded-l"
                            disabled={loading}
                        />
                        <button
                            onClick={handleSend}
                            className="bg-blue-500 text-white px-4 py-2 rounded-r"
                            disabled={loading}
                        >
                            送信
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}