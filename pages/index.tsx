import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Home() {
    const router = useRouter();
    const { user: queryUser, query: queryText } = router.query;

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [user, setUser] = useState<string>("unknown");
    const [history, setHistory] = useState<{ id: string; name: string }[]>([]);
    const messageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof queryUser === "string") setUser(queryUser);
        if (typeof queryText === "string" && queryText) handleSend(queryText);
    }, [queryUser, queryText]);

    useEffect(() => {
        if (!user || user === "unknown") return;
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
    }, [user]);

    useEffect(() => {
        if (!conversationId) return;
        fetch(`/api/proxy/messages?user=${user}&conversation_id=${conversationId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data?.data) {
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
            });
    }, [conversationId]);

    useEffect(() => {
        const container = messageRef.current;
        if (container) container.scrollTop = container.scrollHeight;
    }, [messages]);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;
        setInput("");

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

    const handleDeleteConversation = async (id: string) => {
        await fetch(`/api/proxy/conversations/${id}`, { method: "DELETE" });
        setHistory((prev) => prev.filter((conv) => conv.id !== id));
        if (conversationId === id) {
            setConversationId(null);
            setMessages([]);
        }
    };

    const handleRenameConversation = async (id: string) => {
        const newName = prompt("新しい会話名を入力してください：");
        if (!newName) return;
        await fetch(`/api/proxy/conversations/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName }),
        });
        setHistory((prev) =>
            prev.map((conv) => (conv.id === id ? { ...conv, name: newName } : conv))
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
                <Image src="/Sofia_logo.png" alt="Sofia" width={32} height={32} />
                <h1 className="text-2xl font-bold text-indigo-700">Hello Sofia 🪷</h1>
            </div>
            <p className="text-sm text-gray-500">
                👤 ユーザーID: <span className="font-mono">{user}</span>
                <br />
                💬 会話ID: <span className="font-mono">{conversationId || "(なし)"}</span>
            </p>

            <div className="my-4">
                <label className="text-sm font-medium text-gray-700">
                    会話履歴：
                    <select
                        onChange={(e) => handleSelectConversation(e.target.value)}
                        value={conversationId || "new"}
                        className="ml-2 rounded border border-gray-300 px-2 py-1"
                    >
                        <option value="new">🆕 新しい会話</option>
                        {history.map((h) => (
                            <option key={h.id} value={h.id}>
                                {h.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => conversationId && handleRenameConversation(conversationId)}
                        className="ml-2 text-sm text-blue-600 underline"
                    >
                        名前変更
                    </button>
                    <button
                        onClick={() => conversationId && handleDeleteConversation(conversationId)}
                        className="ml-2 text-sm text-red-600 underline"
                    >
                        削除
                    </button>
                </label>
            </div>

            <div
                id="message-box"
                ref={messageRef}
                className="mx-auto max-w-2xl h-[400px] overflow-y-auto space-y-2 rounded bg-white p-4 text-left shadow"
            >
                {messages.map((m, i) => (
                    <p key={i} className="whitespace-pre-wrap text-violet-700">
                        {m}
                    </p>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
                {/* ユーザーアイコンのプレースホルダ */}
                <Image
                    src="/User_icon.png"
                    alt="User"
                    width={32}
                    height={32}
                    className="rounded-full"
                />
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                    placeholder="メッセージを入力"
                    className="w-[400px] rounded border border-gray-300 px-4 py-3 shadow text-base"
                />
                <button
                    onClick={() => handleSend(input)}
                    className="p-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition text-white"
                >
                    <Image src="/Sofia_logo.png" alt="Send" width={24} height={24} />
                </button>
            </div>
        </div>
    );
}