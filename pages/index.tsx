import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    const { query: queryParam, user: userParam } = router.query;

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [conversationId, setConversationId] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [historyList, setHistoryList] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        if (typeof userParam === 'string') setUserId(userParam);
    }, [userParam]);

    useEffect(() => {
        if (queryParam && typeof queryParam === 'string') {
            sendMessage(queryParam);
        }
    }, [queryParam]);

    useEffect(() => {
        if (userId) {
            fetch(`/api/proxy/conversations?user=${userId}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.data) {
                        setHistoryList(data.data);
                    }
                });
        }
    }, [userId]);

    const sendMessage = async (text: string) => {
        if (!text) return;

        const res = await fetch('/api/proxy/chat-messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                inputs: {},
                query: text,
                response_mode: 'blocking',
                conversation_id: conversationId || undefined,
                user: userId,
            }),
        });

        const data = await res.json();
        setMessages((prev) => [...prev, `👤 ${text}`, `😺 ${data.answer || '[応答なし]'}`]);
        if (data.conversation_id) setConversationId(data.conversation_id);
        setInput('');
    };

    const handleSelectHistory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        setConversationId(selectedId);
        // 会話履歴取得＆表示
        fetch(`/api/proxy/messages?conversation_id=${selectedId}&user=${userId}`)
            .then((res) => res.json())
            .then((data) => {
                const restored = data.data?.map((msg: any) => `${msg.role === 'user' ? '👤' : '😺'} ${msg.content}`) || [];
                setMessages(restored);
            });
    };

    return (
        <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
            <h1>
                Hello Sofia <span style={{ color: 'green' }}>✅</span>
            </h1>
            <p>👤 ユーザーID: {userId || 'unknown'}</p>
            <p>🧠 会話ID: {conversationId || '（未接続）'}</p>
            <label>
                会話履歴：
                <select onChange={handleSelectHistory} value={conversationId}>
                    <option value="">🆕 新しい会話</option>
                    {historyList.map((h) => (
                        <option key={h.id} value={h.id}>
                            {h.name || h.id.slice(0, 12)}
                        </option>
                    ))}
                </select>
            </label>

            <div style={{ background: '#f5f5f5', margin: '20px 0', padding: 10 }}>
                {messages.map((msg, idx) => (
                    <p key={idx}>{msg}</p>
                ))}
            </div>

            <input
                style={{ width: '300px', marginRight: 10 }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="メッセージを入力"
            />
            <button onClick={() => sendMessage(input)}>送信</button>
        </div>
    );
}