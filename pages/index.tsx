// pages/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    const { query } = router;
    const initialQuery = typeof query.query === 'string' ? query.query : '';
    const initialUser = typeof query.user === 'string' ? query.user : 'unknown';

    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState(initialQuery);
    const [conversationId, setConversationId] = useState<string>('');
    const [userId] = useState(initialUser);
    const [history, setHistory] = useState<{ id: string; title: string }[]>([]);

    useEffect(() => {
        if (initialQuery) {
            handleSend();
        }
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const res = await fetch('/api/proxy/chat-messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                inputs: {},
                query: input,
                response_mode: 'blocking',
                conversation_id: conversationId || '',
                user: userId,
            }),
        });

        const data = await res.json();

        setMessages((prev) => [
            ...prev,
            `👤 ${input}`,
            `😺 ${data.answer || '[応答なし]'}`,
        ]);

        if (data.conversation_id && data.conversation_id !== conversationId) {
            setConversationId(data.conversation_id);
            const newHist = { id: data.conversation_id, title: input.slice(0, 15) || '新しい会話' };
            setHistory((prev) => {
                const exists = prev.find((h) => h.id === newHist.id);
                return exists ? prev : [...prev, newHist];
            });
        }
        setInput('');
    };

    return (
        <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
            <h1>Hello Sofia ✅</h1>
            <p>👤 ユーザーID: {userId}</p>
            {conversationId && <p>🧠 会話ID: {conversationId}</p>}

            <div>
                <label>💬 会話履歴：</label>
                <select
                    onChange={(e) => setConversationId(e.target.value)}
                    value={conversationId || ''}
                >
                    <option value=''>新しい会話</option>
                    {history.map((h) => (
                        <option key={h.id} value={h.id}>{h.title}</option>
                    ))}
                </select>
            </div>

            <div style={{ margin: '1rem 0', background: '#f5f5f5', padding: '1rem' }}>
                {messages.map((m, i) => (
                    <p key={i}>{m}</p>
                ))}
            </div>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ width: '300px', marginRight: '0.5rem' }}
            />
            <button onClick={handleSend}>送信</button>
        </div>
    );
}