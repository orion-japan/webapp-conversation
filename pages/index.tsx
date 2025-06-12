// pages/index.tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    const { user, query } = router.query;

    const [conversationId, setConversationId] = useState('');
    const [input, setInput] = useState(query || '');
    const [messages, setMessages] = useState<string[]>([]);
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState('');

    const apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY;

    const fetchMessages = async (convId: string) => {
        const res = await fetch(`/api/proxy/messages?conversation_id=${convId}&user=${user}`);
        const data = await res.json();
        if (Array.isArray(data.data)) {
            const history = data.data.reverse().map((msg: any) => {
                return msg.query ? `👤 ${msg.query}` : msg.answer ? `😺 ${msg.answer}` : '';
            }).filter(Boolean);
            setMessages(history);
        }
    };

    const fetchConversations = async () => {
        const res = await fetch(`/api/proxy/conversations?user=${user}`);
        const data = await res.json();
        setConversations(data.data || []);
    };

    const handleSend = async () => {
        const res = await fetch('/api/proxy/chat-messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                inputs: {},
                query: input,
                response_mode: 'blocking',
                user,
                conversation_id: selectedConversationId || undefined,
            }),
        });
        const data = await res.json();
        setMessages((prev) => [...prev, `👤 ${input}`, `😺 ${data.answer || '[応答なし]'}`]);
        if (data.conversation_id) {
            setConversationId(data.conversation_id);
            setSelectedConversationId(data.conversation_id);
            fetchConversations();
        }
        setInput('');
    };

    useEffect(() => {
        if (query) {
            handleSend();
        }
    }, [query]);

    useEffect(() => {
        if (selectedConversationId) {
            fetchMessages(selectedConversationId);
        }
    }, [selectedConversationId]);

    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user]);

    const handleSelectConversation = (e: any) => {
        const selectedId = e.target.value;
        if (selectedId === 'new') {
            setMessages([]);
            setSelectedConversationId('');
            setConversationId('');
        } else {
            setSelectedConversationId(selectedId);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Hello Sofia ✅</h1>
            <p>👤 ユーザーID: {user}</p>
            <p>🎯 会話ID: {conversationId}</p>
            <label>
                会話履歴：
                <select value={selectedConversationId || 'new'} onChange={handleSelectConversation}>
                    <option value="new">🆕 新しい会話</option>
                    {conversations.map((conv: any) => (
                        <option key={conv.id} value={conv.id}>{conv.name || '無題の会話'}</option>
                    ))}
                </select>
            </label>

            <div style={{ background: '#f2f2f2', margin: '20px 0', padding: 10 }}>
                {messages.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                ))}
            </div>

            <input
                placeholder="メッセージを入力"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ width: 300 }}
            />
            <button onClick={handleSend}>送信</button>
        </div>
    );
}