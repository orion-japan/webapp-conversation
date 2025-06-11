// pages/index.tsx

import { useState } from 'react';

export default function Home() {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        const res = await fetch('/api/proxy?path=chat-messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: { text: input }, response_mode: 'blocking' })
        });
        const data = await res.json();
        setMessages([...messages, `👤 ${input}`, `🤖 ${data.answer}`]);
        setInput('');
    };

    return (
        <div>
            <h1>Hello Sofia ✅</h1>
            <div>
                {messages.map((m, i) => <p key={i}>{m}</p>)}
            </div>
            <input value={input} onChange={e => setInput(e.target.value)} />
            <button onClick={sendMessage}>送信</button>
        </div>
    );
}