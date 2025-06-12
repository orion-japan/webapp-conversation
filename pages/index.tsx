import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [conversationId, setConversationId] = useState('');
    const [conversations, setConversations] = useState<any[]>([]);
    const [userId, setUserId] = useState('669933'); // ユーザーID（Clickから動的に受け取る場合は調整）

    // 会話一覧を取得
    useEffect(() => {
        if (!userId) return;
        axios.get(`/api/proxy/conversations?user=${userId}`)
            .then(res => setConversations(res.data.data))
            .catch(console.error);
    }, [userId]);

    // 会話メッセージ履歴を取得
    useEffect(() => {
        if (!conversationId) return;
        axios.get(`/api/proxy/messages?user=${userId}&conversation_id=${conversationId}`)
            .then(res => {
                const reversed = [...res.data.data].reverse();
                setMessages(reversed);
                setInput('');
            })
            .catch(console.error);
    }, [conversationId]);

    // 新しい会話を開始
    const startNewConversation = () => {
        setConversationId('');
        setMessages([]);
        setInput('');
    };

    // メッセージ送信処理
    const sendMessage = async () => {
        if (!input.trim()) return;
        const payload = {
            inputs: {},
            query: input,
            response_mode: 'blocking',
            conversation_id: conversationId || undefined,
            user: userId
        };

        const res = await axios.post('/api/proxy/chat-messages', payload);
        const answer = res.data.answer;
        const id = res.data.conversation_id;

        setMessages(prev => [...prev, { query: input, answer }]);
        if (!conversationId) setConversationId(id);
        setInput('');
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Hello Sofia <span style={{ color: 'green' }}>✅</span></h1>
            <p>👤 ユーザーID: {userId}</p>
            <p>🧠 会話ID: {conversationId || '(新規)'}</p>

            <label>会話履歴：</label>
            <select onChange={e => setConversationId(e.target.value)} value={conversationId}>
                <option value="">🆕 新しい会話</option>
                {conversations.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name || '(No title)'}</option>
                ))}
            </select>

            <div style={{ background: '#f8f8f8', padding: '1rem', marginTop: '1rem' }}>
                {messages.map((msg, idx) => (
                    <p key={idx}>
                        👤 {msg.query} <br />
                        🤖 {msg.answer || '[応答なし]'}
                    </p>
                ))}
            </div>

            <div style={{ marginTop: '1rem' }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="メッセージを入力"
                />
                <button onClick={sendMessage}>送信</button>
            </div>
        </div>
    );
}