// pages/index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
    const router = useRouter();
    const { user: queryUser, query: queryText } = router.query;

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [user, setUser] = useState<string>("unknown");
    const [history, setHistory] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        if (typeof queryUser === "string") {
            setUser(queryUser);
        }

        if (typeof queryText === "string" && queryText) {
            handleSend(queryText);
        }
    }, [queryUser, queryText]);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        const res = await fetch("/api/proxy/chat-messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: {},
                query: text,
                response_mode: "blocking",
                conversation_id: conversationId,
                user: user,
            }),
        });

        const data = await res.json();

        setMessages((prev) => [
            ...prev,
            `\u{1F9D1} ${text}`,
            `\u{1F63A} ${data.answer || "[応答なし]"}`,
        ]);

        if (data.conversation_id && data.conversation_id !== conversationId) {
            setConversationId(data.conversation_id);

            // 会話名もDifyから取得（仮に直後はqueryTextを仮名とする）
            setHistory((prev) => [
                ...prev,
                { id: data.conversation_id, name: text.slice(0, 10) },
            ]);
        }

        setInput("");
    };

    const handleSelectConversation = async (id: string) => {
        if (id === "new") {
            setConversationId(null);
            setMessages([]);
        } else {
            setConversationId(id);
            const res = await fetch(`/api/proxy/messages?conversation_id=${id}&user=${user}`);
            const data = await res.json();

            const sorted = data.data.reverse();
            const restoredMessages = sorted.flatMap((m: any) => [
                `\u{1F9D1} ${m.query}`,
                `\u{1F63A} ${m.answer || "[応答なし]"}`,
            ]);

            setMessages(restoredMessages);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Hello Sofia ✅</h1>

            <p>👤 ユーザーID: {user}</p>
            <p>💬 会話ID: {conversationId || "(なし)"}</p>

            <label>
                会話履歴：
                <select
                    onChange={(e) => handleSelectConversation(e.target.value)}
                    value={conversationId || "new"}
                >
                    <option value="new">🆕 新しい会話</option>
                    {history.map((h) => (
                        <option key={h.id} value={h.id}>
                            {h.name}
                        </option>
                    ))}
                </select>
            </label>

            <div style={{ margin: "1em 0", padding: 10, background: "#f5f5f5" }}>
                {messages.map((m, i) => (
                    <p key={i}>{m}</p>
                ))}
            </div>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ width: 300 }}
                placeholder="メッセージを入力"
            />
            <button onClick={() => handleSend(input)}>送信</button>
        </div>
    );
}