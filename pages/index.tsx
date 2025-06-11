import { useEffect, useState } from 'react';

export default function Home() {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string>(''); // ← userIdを取得用に

    // 🌟 ClickからURLパラメータ取得
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get('user');
        const query = urlParams.get('query');

        if (user) {
            setUserId(user);
        }
        if (query) {
            sendMessage(query, user ?? '');
        }
    }, []);

    const sendMessage = async (message: string, userOverride?: string) => {
        const user = userOverride ?? userId;
        if (!message.trim()) return;

        const res = await fetch('/api/proxy?path=chat-messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: {},
                query: message,
                response_mode: 'blocking',
                conversation_id: conversationId,
                user: user,
            }),
        });

        const data = await res.json();
        console.log('🟢 Dify response:', data);

        setMessages((prev) => [
            ...prev,
            `👤 ${message}`,
            `🤖 ${data.answer ?? '(応答なし)'}`,
        ]);

        if (data.conversation_id) {
            setConversationId(data.conversation_id);
        }

        setInput('');
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>
                Hello Sofia <span style={{ color: 'green' }}>✅</span>
            </h1>

            {conversationId && <p>🧠 会話ID: <strong>{conversationId}</strong></p>}
            {userId && <p>👤 ユーザーID: <strong>{userId}</strong></p>}

            <div
                style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    border: '1px solid #ccc',
                    minHeight: '150px',
                }}
            >
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
                <button onClick={() => sendMessage(input)}>送信</button>
            </div>
        </div>
    );
}