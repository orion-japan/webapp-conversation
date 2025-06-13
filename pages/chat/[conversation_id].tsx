// pages/chat/[conversation_id].tsx
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';

const API_URL = 'https://api.dify.ai/v1/chat-messages';
const MESSAGES_URL = 'https://api.dify.ai/v1/messages';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

export default function ChatPage() {
    const router = useRouter();
    const { conversation_id } = router.query;
    const [currentId, setCurrentId] = useState(conversation_id);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // スクロール制御
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // 会話切替時の過去ログ取得
    useEffect(() => {
        if (conversation_id) {
            setCurrentId(conversation_id);
            fetchMessages(conversation_id as string);
        }
    }, [conversation_id]);

    const fetchMessages = async (cid: string) => {
        try {
            const res = await fetch(`${MESSAGES_URL}?conversation_id=${cid}`, {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                },
            });
            const data = await res.json();
            const logs = data.data.map((msg: any) => `${msg.role === 'user' ? 'わたし' : 'Sofia'}: ${msg.content}`);
            setMessages(logs);
        } catch (err) {
            console.error('メッセージ取得失敗', err);
        }
    };

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
        <div style={{ padding: '20px' }}>
            <div style={{ height: '70vh', overflowY: 'auto', marginBottom: '10px' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{ marginBottom: '5px' }}>{msg}</div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div style={{ display: 'flex' }}>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="あなたの内なる響きを言葉にしてください…"
                    style={{ flex: 1, marginRight: '10px' }}
                />
                <button onClick={handleSend} disabled={loading}>
                    {loading ? '送信中…' : '響かせる'}
                </button>
            </div>
        </div>
    );
}