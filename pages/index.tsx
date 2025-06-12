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

    // 初回 user/query 取得
    useEffect(() => {
        if (typeof queryUser === "string") setUser(queryUser);
        if (typeof queryText === "string" && queryText) {
            handleSend(queryText);
        }
    }, [queryUser, queryText]);

    // 会話履歴の取得
    useEffect(() => {
        if (user && user !== "unknown") {
            fetch(`/api/proxy/conversations?user=${user}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data?.data) {
                        setHistory(
                            data.data.map((conv: any) => ({
                                id: conv.id,
                                name: conv.name || conv.id.slice(0, 10),
                            }))
                        );
                    }
                });
        }
    }, [user]);

    // 会話ID変更時：履歴読み込み（1秒待機してから）
    useEffect(() => {
        if (conversationId) {
            setMessages(["📥 履歴を読み込み中..."]);

            const timeout = setTimeout(() => {
                fetch(
                    `/api/proxy/messages?user=${user}&conversation_id=${conversationId}`
                )
                    .then((res) => {
                        if (!res.ok) throw new Error("履歴取得失敗");
                        return res.json();
                    })
                    .then((data) => {
                        if (data?.data?.length > 0) {
                            const restored = data.data
                                .map((msg: any) => [
                                    `🧑 ${msg.query}`,
                                    `😺 ${msg.answer || "[応答なし]"}`,
                                ])
                                .flat();
                            setMessages(restored);
                        } else {
                            setMessages(["😺 [履歴が見つかりませんでした]"]);
                        }
                    })
                    .catch((err) => {
                        setMessages([
                            `🚫 履歴の取得中にエラーが発生しました：${err.message}`,
                        ]);
                    });
            }, 1000); // ← ディレイ挿入

            return () => clearTimeout(timeout);
        } else {
            setMessages([]);
        }
    }, [conversationId]);

    // メッセージ送信
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
            setHistory((prev) => [
                { id: data.conversation_id, name: text.slice(0, 10) },
                ...prev,
            ]);
        }

        setInput("");
    };

    const handleSelectConversation = (id: string) => {
        if (id === "new") {
            setConversationId(null);
            setMessages([]);
        } else {
            setConversationId(id);
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