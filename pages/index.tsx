import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string>(''); // Clickから受け取る

    const router = useRouter();

    useEffect(() => {
        const user = router.query.user as string;
        const query = router.query.query as string;

        if (user) setUserId(user);

        if (query && user) {
            sendMessage(query, user);
        }
    }, [router.query]);

    const sendMessage = async (customInput?: string, customUser?: string) => {
        const finalInput = customInput ?? input;
        const finalUser = customUser ?? userId;

        if (!finalInput.trim()) return;

        const res = await fetch('/api/proxy/chat-messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                inputs: {},
                query: finalInput,
                response_mode: 'blocking',
                conversation_id: conversationId,
                user: finalUser,
            }),
        });

        const data = await res.json();

        setMessages((prev) => [
            ...prev,
            `👤 ${finalInput}`,
            `🤖 ${data.answer || '(応答なし)'}`,
        ]);

        if (data.conversation_id) {
            setConversationId(data.conversation_id);
        }

        setInput('');
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Hello Sofia ✅</h1>
            {conversationId && (
                <p>🧠 会話ID: <strong>{conversationId}</strong></p>
            )}
            {userId && (
                <p>👤 ユーザーID: <strong>{userId}</strong></p>
            )}
            <div style={{ background: '#f8f8f8', padding: '1rem', minHeight: '150px' }}>
                {messages.map((msg, i) => (
                    <p key={i}>{msg}</p>
                ))}
            </div>
            <div style={{ marginTop: '1rem' }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ width: '300px', marginRight: '0.5rem' }}
                />
                <button onClick={() => sendMessage()}>送信</button>
            </div>
        </div>
    );
}