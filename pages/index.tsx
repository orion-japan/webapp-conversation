import { useState, useEffect } from 'react';

export default function Home() {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const userId = '669933'; // Clickなどと連携可

    const sendMessage = async () => {
        if (!input.trim()) return;

        const res = await fetch('/api/proxy/chat-messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: { text: input },
                query: input,
                response_mode: 'blocking',
                conversation_id: conversationId,
                user: userId,
            }),
        });

        const data = await res.json();

        setMessages((prev) => [
            ...prev,
            `👤 ${input}`,
            `🤖 ${data.answer || '(応答なし)'}`,
        ]);

        if (data.conversation_id) {
            setConversationId(data.conversation_id);
        }

        setInput('');
    };

    return (
        <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
            <h1>
                Hello Sofia <span style={{ color: 'green' }}>✅</span>
            </h1>

            {conversationId && (
                <>
                    <p>🧠 会話ID: <strong>{conversationId}</strong></p>
                    <p>👤 ユーザーID: <strong>{userId}</strong></p>
                </>
            )}

            <div style={{ margin: '1rem 0', minHeight: '200px', background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
                {messages.map((m, i) => (
                    <p key={i} style={{ margin: '0.25rem 0' }}>{m}</p>
                ))}
            </div>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ width: '70%', padding: '0.5rem' }}
            />
            <button onClick={sendMessage} style={{ padding: '0.5rem' }}>送信</button>
        </div>
    );
}