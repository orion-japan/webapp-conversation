// pages/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    const { user, query } = router.query;

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [conversationId, setConversationId] = useState<string>('');
    const [historyList, setHistoryList] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        if (typeof user === 'string' && typeof query === 'string') {
            sendMessage(query);
        }
    }, [user, query]);

    useEffect(() => {
        if (typeof user === 'string') {
            fetch(`/api/proxy/conversations?user=${user}`)
                .then((res) => res.json())
                .then((data) => {
                    const list = data.data.map((item: any) => ({
                        id: item.id,
                        name: item.name || 'タイトルなし',
                    }));
                    setHistoryList(list);
                });
        }
    }, [user]);

    const sendMessage = async (message: string) => {
        if (!message.trim()) return;

        setMessages((prev) => [...prev, `👤 ${message}`]);
        setInput('');

        const res = await fetch('/api/proxy/chat-messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                inputs: {},
                query: message,
                response_mode: 'blocking',
                conversation_id: conversationId,
                user,
            }),
        });

        const data = await res.json();
        if (data.answer) {
            setMessages((prev) => [...prev, `🤖 ${data.answer}`]);
        } else {
            setMessages((prev) => [...prev, '🤖 [応答なし]']);
        }
        if (data.conversation_id) {
            setConversationId(data.conversation_id);
        }
    };

    const fetchHistoryMessages = async (id: string) => {
        const res = await fetch(`/api/proxy/conversations/${id}/messages`);
        const data = await res.json();
        const history = data.data.map((msg: any) => `🤖 ${msg.answer}`);
        setMessages(history);
        setConversationId(id);
    };

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        if (selectedId === '__new') {
            setConversationId('');
            setMessages([]);
        } else {
            fetchHistoryMessages(selectedId);
        }
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Hello Sofia ✅</h1>
            <p>👤 ユーザーID: {user || 'unknown'}</p>
            <p>💬 会話ID: {conversationId || '（新規）'}</p>

            <label>会話履歴： </label>
            <select onChange={handleSelect} value={conversationId || '__new'}>
                <option value="__new">新しい会話</option>
                {historyList.map((h) => (
                    <option key={h.id} value={h.id}>
                        {h.name}
                    </option>
                ))}
            </select>

            <div style={{ background: '#f4f4f4', padding: '1rem', margin: '1rem 0' }}>
                {messages.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                ))}
            </div>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ width: '300px' }}
            />
            <button onClick={() => sendMessage(input)}>送信</button>
        </div>
    );
}