import { useState, useEffect } from 'react';

export default function Home() {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const userId = '669933'; // 任意のユーザーID（ClickやUUIDでもOK）

    const sendMessage = async () => {
        if (!input.trim()) return;

        const res = await fetch('/api/proxy?path=chat-messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: { text: input },
                query: input,
                response_mode: 'blocking',
                conversation_id: conversationId, // nullなら新規会話として扱われる
                user: userId,
            }),
        });

        const data = await res.json();
        console.log('🎯 Dify response:', data);

        setMessages((prev) => [
            ...prev,
            `👤 ${input}`,
            `🤖 ${data.answer || '(応答なし)'}`,
        ]);

        // conversation_id を取得・保存
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

            {conversationId && (
                <p>🧠 会話ID: <strong>{conversationId}</strong></p>
                <p>👤 ユーザーID: <strong>{userId}</strong></p>
            )}

            <div>
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
                <button onClick={sendMessage}>送信</button>
            </div>
        </div>
    );
}