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
            fetchConversationList(queryUser);
        }

        if (typeof queryText === "string" && queryText) {
            handleSend(queryText);
        }
    }, [queryUser, queryText]);

    const fetchConversationList = async (userId: string) => {
        const res = await fetch(`/api/proxy/conversations?user=${userId}`);
        const data = await res.json();
        if (data?.data) {
            setHistory(data.data.map((c: any) => ({ id: c.id, name: c.name || "無題の会話" })));
        }
    };

    const fetchMessages = async (convId: string) => {
        const res = await fetch(`/api/proxy/messages?user=${user}&conversation_id=${convId}`);
        const data = await res.json();
        if (data?.data) {
            const reversed = [...data.data].reverse();
            setMessages(
                reversed.flatMap((m: any) => [
                    `🧑 ${m.query || ""}`,
                    `😺 ${m.answer || "[応答なし]"}`,
                ])
            );
        }
    };

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
            `🧑 ${text}`,
            `😺 ${data.answer || "[応答なし]"}`,
        ]);

        if (data.conversation_id && data.conversation_id !== conversationId) {
            setConversationId(data.conversation_id);
            fetchConversationList(user);
        }

        setInput("");
    };

    const handleSelectConversation = (id: string) => {
        if (id === "new") {
            setConversationId(null);
            setMessages([]);
        } else {
            setConversationId(id);
            fetchMessages(id);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>
                Hello Sofia ✅
            </h1>

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
            />
            <button onClick={() => handleSend(input)}>送信</button>
        </div>
    );
}