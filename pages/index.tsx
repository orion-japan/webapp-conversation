import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    const { query: routerQuery } = router;

    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string>(''); // ← URLから取得

    // ✅ 初回読み込み時にURLの user, query を反映
    useEffect(() => {
        if (typeof routerQuery.user === 'string') {
            setUserId(routerQuery.user);
        }

        if (typeof routerQuery.query === 'string') {
            setInput(routerQuery.query);
            handleSend(routerQuery.query); // 初期メッセージ送信
        }
    }, [routerQuery]);

    const handleSend = async (overrideText?: string) => {
        const textToSend = overrideText || input;
        if (!textToSend.trim()) return;

        const res = await fetch('/api/proxy/chat-messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: { text: textToSend },
                query: textToSend,
                response_mode: 'blocking',
                conversation_id: conversationId,
                user: userId || 'default-user',
            }),
        });

        const data = await res.json();
        console.log('🎯 Dify response:', data);

        setMessages((prev) => [
            ...prev,
            `👤 ${textToSend}`,
            `🤖 ${data.answer || '(応答なし)'}`,
        ]);

        if (data.conversation_id) {
            setConversationId(data.conversation_id);
        }

        if (!overrideText) setInput('');
    };

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

            <div style={{ background: '#f8f8f8', padding: '1rem', marginBottom: '1rem' }}>
                {messages.map((m, i) => (
                    <p key={i}>{m}</p>
                ))}
            </div>

            <div>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ width: '300px', marginRight: '0.5rem' }}
                />
                <button onClick={() => handleSend()}>送信</button>
            </div>
        </div>
    );
}