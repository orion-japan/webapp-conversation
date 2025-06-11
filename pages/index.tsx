import { useState, useEffect } from 'react';

export default function Home() {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string>('');

    // 🌱 メッセージ送信処理
    const sendMessage = async (message: string, user: string) => {
        if (!message.trim()) return;

        try {
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
        } catch (err) {
            console.error('❌ fetch error:', err);
        }

        setInput('');
    };

    // 🌱 URLパラメータから user/query を抽出して実行
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get('user');
        const query = urlParams.get('query');

        if (user) {
            setUserId(user);

            if (query) {
                // useEffect内でasync関数をラップして即時実行
                (async () => {
                    await sendMessage(query, user);
                })();
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