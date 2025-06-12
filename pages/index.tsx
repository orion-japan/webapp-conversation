// pages/index.tsx
import { useState, useEffect } from 'react';

export default function Home() {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string>('');
    const [historyIds, setHistoryIds] = useState<string[]>([]);

    // URLパラメータから初期化
    useEffect(() => {
        const url = new URL(window.location.href);
        const uid = url.searchParams.get('user');
        const cid = url.searchParams.get('conversation_id');
        const query = url.searchParams.get('query');
        if (uid) setUserId(uid);
        if (cid) setConversationId(cid);
        if (query) {
            sendMessage(query);
        }
    }, []);

    // 会話履歴取得
    useEffect(() => {
        if (!conversationId) return;
        const fetchMessages = async () => {
            const res = await fetch(`/api/proxy?path=messages&conversation_id=${conversationId}`);
            const data = await res.json();
            const history = data.map((msg: any) =>
                msg.answer ? `🤖 ${msg.answer}` : `👤 ${msg.inputs?.text || '[User]'}`
            );
            setMessages(history);
        };
        fetchMessages();
    }, [conversationId]);

    // 会話一覧取得（ID用）
    useEffect(() => {
        const loadConversations = async () => {
            const res = await fetch(`/api/proxy?path=conversations`);
            const data = await res.json();
            const ids = data.map((c: any) => c.id);
            setHistoryIds(ids);
        };
        loadConversations();
    }, []);

    const sendMessage = async (text?: string) => {
        const message = text || input;
        if (!message.trim()) return;

        const res = await fetch('/api/proxy?path=chat-messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                inputs: { text: message },
                query: message,
                response_mode: 'blocking',
                conversation_id: conversationId,
                user: userId,
            }),
        });

        const data = await res.json();
        setMessages((prev) => [
            ...prev,
            `👤 ${message}`,
            `🤖 ${data.answer || '(応答なし)'}`,
        ]);

        if (data.conversation_id) setConversationId(data.conversation_id);
        setInput('');
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Hello Sofia ✅</h1>
            {conversationId && <p>🧠 会話ID: <strong>{conversationId}</strong></p>}
            {userId && <p>👤 ユーザーID: <strong>{userId}</strong></p>}

            {/* 履歴ID選択 */}
            <select
                onChange={(e) => setConversationId(e.target.value)}
                value={conversationId || ''}
                style={{ marginBottom: '1rem' }}
            >
                <option value="">🆕 新しい会話</option>
                {historyIds.map((id) => (
                    <option key={id} value={id}>{id}</option>
                ))}
            </select>

            <div style={{ marginBottom: '1rem', background: '#f9f9f9', padding: '1rem' }}>
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
                <button onClick={() => sendMessage()}>送信</button>
            </div>
        </div>
    );
}