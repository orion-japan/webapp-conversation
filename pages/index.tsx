import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
    const router = useRouter();
    const { user: queryUser, query: queryText } = router.query;

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [user, setUser] = useState<string>("unknown");

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
            headers: { "Content-Type": "application/json" },
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
        }

        setInput("");
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Hello Sofia ✅</h1>
            <p>👤 ユーザーID: {user}</p>
            <p>💬 会話ID: {conversationId || "(なし)"}</p>

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