import { useState } from 'react';

export default function Home() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);

    const handleSend = async () => {
        if (!input.trim()) return;

        const res = await fetch('/api/proxy/chat-messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                inputs: {},
                query: input,
                response_mode: 'blocking',
                conversation_id: conversationId,
                user: 'user-001',
            }),
        });

        const data = await res.json();

        setMessages((prev) => [
            ...prev,
            `🧑 ${input}`,
            `😺 ${data.answer || '[応答なし]'}`,
        ]);

        if (data.conversation_id) setConversationId(data.conversation_id);
        setInput('');
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Hello Sofia ✅</h1>
            <p>🧑 会話ID: {conversationId || '(新規)'}</p>

            <div style={{ background: '#eee', padding: 10, marginBottom: 10 }}>
                {messages.map((m, i) => <p key={i}>{m}</p>)}
            </div>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ width: 300 }}
                placeholder="メッセージを入力"
            />
            <button onClick={handleSend}>送信</button>
        </div>
    );
}