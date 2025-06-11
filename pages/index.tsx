import { useState, useEffect } from 'react';

export default function Home() {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string>('');

    // 🌱 Difyへ送信する関数（queryとuserを引数にする）
    const sendMessage = async (message: string, user: string) => {
        if (!message.trim()) return;

        const res = await fetch('/api/proxy/chat-messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                inputs: { text: message },
                query: message,
                response_mode: 'blocking',
                conversation_id: conversationId,
                user: user,
            }),
        });

        const data = await res.json();
        console.log('🎯 Dify response:', data);

        setMessages((prev) => [
            ...prev,
            `👤 ${message}`,
            `🤖 ${data.answer || '(応答なし)'}`,
        ]);

        if (data.conversation_id) {
            setConversationId(data.conversation_id);
        }

        setInput('');
    };

    // 🌱 Clickから渡されたURLパラメータ（user, query）を読み取る
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get('user');
        const query = urlParams.get('query');

        if (user) {
            setUserId(user); // ユーザーを記録

            if (query) {
                sendMessage(query, user); // 最初の発話を送信
            }
        }
    }, []);

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>
                Hello Sofia <span style={{ color: 'green' }}>✅</span>
            </h1>

            {conversationId && (
                <p>🧠 会話ID: <strong>{conversationId}</strong></p>
            )}
            {userId && (
                <p>👤 ユーザーID: <strong>{userId}</strong></p>
            )}

            <div style={{
                minHeight: '150px',
                padding: '1rem',
                marginBottom: '1rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                background: '#f9f9f9'
            }}>
                {messages.map((m, i) => (
                    <p key={i}>{m}</p>
                ))}
            </div>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ width: '300px', marginRight: '0.5rem' }}
            />
            <button onClick={() => sendMessage(input, userId)}>送信</button>
        </div>
    );
}