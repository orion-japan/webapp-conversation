// pages/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [conversationId, setConversationId] = useState('');
    const [userId, setUserId] = useState('');
    const [conversations, setConversations] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        const query = router.query.query as string || '';
        const user = router.query.user as string || '';
        if (user) setUserId(user);
        if (query) {
            handleSend(query);
        }
        fetch(`/api/proxy/conversations?user=${user}`).then(res => res.json()).then(data => {
            setConversations((data.data || []).map((c: any) => ({
                id: c.id,
                name: c.name || '(無題)'
            })));
        });
    }, [router.query]);

    const handleSend = async (text: string) => {
        setMessages(prev => [...prev, `👤 ${text}`]);
        const res = await fetch(`/api/proxy/chat-messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                inputs: {},
                query: text,
                response_mode: 'blocking',
                conversation_id: conversationId || undefined,
                user: userId,
            })
        });
        const data = await res.json();
        if (data.answer) {
            setMessages(prev => [...prev, `😼 ${data.answer}`]);
        } else {
            setMessages(prev => [...prev, `😼 [応答なし]`]);
        }
        if (data.conversation_id) setConversationId(data.conversation_id);
    };

    const onSelectConversation = (id: string) => {
        setConversationId(id);
        setMessages([]);
    }

    return (
        <div style={{ padding: '1rem' }}>
            <h1>Hello Sofia ✅</h1>
            <p>👤 ユーザーID: {userId || 'unknown'}</p>
            <p>📎 会話ID: {conversationId || '(未接続)'}</p>

            <div>
                会話履歴：
                <select value={conversationId} onChange={(e) => onSelectConversation(e.target.value)}>
                    <option value="">🆕 新しい会話</option>
                    {conversations.map(c => (
                        <option key={c.id} value={c.id}>📁 {c.name}</option>
                    ))}
                </select>
            </div>

            <div style={{ background: '#f4f4f4', padding: '1rem', margin: '1rem 0' }}>
                {messages.map((m, i) => (
                    <p key={i}>{m}</p>
                ))}
            </div>

            <input
                style={{ width: '300px' }}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="メッセージを入力"
            />
            <button onClick={() => handleSend(input)}>送信</button>
        </div>
    );
}