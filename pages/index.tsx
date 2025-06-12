// pages/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    const { user, query } = router.query;

    const [input, setInput] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [currentUser, setCurrentUser] = useState('');

    useEffect(() => {
        if (typeof user === 'string') setCurrentUser(user);
        if (typeof query === 'string' && query.trim()) {
            handleSend(query);
            setInput(query);
        }
    }, [user, query]);

    const handleSend = async (msg: string) => {
        if (!msg.trim()) return;

        setMessages((prev) => [...prev, `👤 ${msg}`]);

        const res = await fetch('/api/proxy/chat-messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: {},
                query: msg,
                response_mode: 'blocking',
                conversation_id: conversationId,
                user: currentUser,
            }),
        });

        const data = await res.json();
        const answer = data?.answer || '(応答なし)';
        setMessages((prev) => [...prev, `🤖 ${answer}`]);

        if (data?.conversation_id) setConversationId(data.conversation_id);
        setInput('');
    };

    const handleClick = () => {
        handleSend(input);
    };

    const startNewConversation = () => {
        setConversationId(null);
        setMessages([]);
    };

    return (
        <div style={{ padding: '1.5rem', fontFamily: 'sans-serif' }}>
            <h1>
                Hello Sofia <span style={{ color: 'green' }}>✅</span>
            </h1>

            <p>👤 ユーザーID: {currentUser}</p>

            <button onClick={startNewConversation}>🆕 新しい会話</button>

            <div style={{ marginTop: '1rem', background: '#f6f6f6', padding: '1rem' }}>
                {messages.map((m, i) => (
                    <p key={i}>{m}</p>
                ))}
            </div>

            <div style={{ marginTop: '1rem' }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ width: '300px', marginRight: '0.5rem' }}
                />
                <button onClick={handleClick}>送信</button>
            </div>
        </div>
    );
}