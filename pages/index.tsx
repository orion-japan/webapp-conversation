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

    // ✅ user セット（queryUser 確定後にのみ）
    useEffect(() => {
        if (typeof queryUser === "string") {
            setUser(queryUser);
        }
    }, [queryUser]);

    // ✅ queryText がある場合にだけ送信（user設定後）
    useEffect(() => {
        if (user !== "unknown" && typeof queryText === "string" && queryText) {
            handleSend(queryText);
        }
    }, [user, queryText]);

    // ✅ 会話履歴の取得（user確定後）
    useEffect(() => {
        if (user && user !== "unknown") {
            fetch(`/api/proxy/conversations?user=${user}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data?.data?.length > 0) {
                        const formatted = data.data.map((conv: any) => ({
                            id: conv.id,
                            name: conv.name || conv.id.slice(0, 10),
                        }));
                        setHistory(formatted);

                        // ✅ 最初の履歴を選択（新規開始でない場合）
                        if (!conversationId) {
                            setConversationId(formatted[0].id);
                        }
                    }
                });
        }
    }, [user]);

    // ✅ 履歴の復元（Dify側反映遅延に備えて1秒後取得）
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
            }, 1000);

            return () => clearTimeout(timeout);
        } else {
            setMessages([]);
        }
    }, [conversationId]);

    // ✅ メッセージ送信（即入力クリア・conversation_id更新・履歴追記）
    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        setInput(""); // ✅ 入力即クリア

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
            setHistory((prev) => [
                { id: data.conversation_id, name: text.slice(0, 10) },
                ...prev,
            ]);
        }
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