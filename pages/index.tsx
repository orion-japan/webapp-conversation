// pages/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    const { user, query } = router.query;

    const [input, setInput] = useState(query || '');
    const [messages, setMessages] = useState<string[]>([]);
    const [conversationId, setConversationId] = useState('');
    const [conversationList, setConversationList] = useState<{ id: string, name: string }[]>([]);

    const userId = typeof user === 'string' ? user : 'unknown';

    useEffect(() => {
        if (query) {
            handleSend();
        }
        fetchConversations();
    }, [query]);

    const fetchConversations = async () => {
        const res = await fetch(`/api/proxy/conversations?user=${userId}`);
        const data = await res.json();
        const updatedList = [
            { id: '', name: '新しい会話' },
            ...data.data.map((conv: any) => ({ id: conv.id, name: conv.name || '無題の会話' }))
        ];
        setConversationList(updatedList);
    };

    const fetchMessages = async (uid: string, cid: string) => {
        const res = await fetch(`/api/proxy/conversations/${cid}/messages?user=${uid}`);
        const data = await res.json();
        const msgs: string[] = [];
        data.data.forEach((m: any) => {
            if (m.inputs?.text) msgs.push(`👤 ${m.inputs.text}`);
            if (m.answer) msgs.push(`🐱 ${m.answer}`);
        });
        setMessages(msgs);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const res = await fetch('/api/proxy/chat-messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                inputs: { text: input },
                query: input,
                response_mode: 'blocking',
                conversation_id: conversationId,
                user: userId,
            }),
        });

        const data = await res.json();
        const newAnswer = data.answer || '[応答なし]';
        const newConvId = data.conversation_id;
        setMessages((prev) => [...prev, `👤 ${input}`, `🐱 ${newAnswer}`]);
        setInput('');
        if (newConvId && newConvId !== conversationId) {
            setConversationId(newConvId);
            fetchConversations();
        }
    };

    return (
        <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
            <h1>Hello Sofia ✅</h1>
            <p>👤 ユーザーID: {userId}</p>
            <p>💬 会話ID: {conversationId || '(新規)'}</p>

            <label>会話履歴：</label>
            <select
                value={conversationId}
                onChange={(e) => {
                    const selectedId = e.target.value;
                    setConversationId(selectedId);
                    setMessages([]);
                    if (selectedId) fetchMessages(userId, selectedId);
                }}
            >
                {conversationList.map((conv) => (
                    <option key={conv.id || 'new'} value={conv.id}>
                        {conv.name}
                    </option>
                ))}
            </select>

            <div style={{ background: '#f5f5f5', padding: '1rem', margin: '1rem 0' }}>
                {messages.map((msg, i) => (
                    <p key={i}>{msg}</p>
                ))}
            </div>

            <input
                style={{ width: 300, marginRight: 8 }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="メッセージを入力"
            />
            <button onClick={handleSend}>送信</button>
        </div>
    );
}