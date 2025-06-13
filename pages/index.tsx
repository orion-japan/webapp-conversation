// v2 Sofia UI with Icon, Avatar, Styling Enhancements
import { useEffect, useState } from "react";
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
    const [sending, setSending] = useState(false);
    const [cache, setCache] = useState<{ [id: string]: string[] }>({});
    const userImageUrl = "/userAvatar.png"; // static avatar

    useEffect(() => {
        if (typeof queryUser === "string") setUser(queryUser);
    }, [queryUser]);

    useEffect(() => {
        if (user !== "unknown" && typeof queryText === "string" && queryText) {
            handleSend(queryText);
        }
    }, [user, queryText]);

    useEffect(() => {
        if (user && user !== "unknown") {
            fetch(`/api/proxy/conversations?user=${user}&limit=100`)
                .then((res) => res.json())
                .then((data) => {
                    if (data?.data?.length > 0) {
                        const formatted = data.data.map((conv: any) => ({
                            id: conv.id,
                            name: conv.name || conv.id.slice(0, 10),
                        }));
                        setHistory(formatted);
                        if (!conversationId) setConversationId(formatted[0].id);
                    }
                });
        }
    }, [user]);

    useEffect(() => {
        if (conversationId) {
            if (cache[conversationId]) {
                setMessages(cache[conversationId]);
            } else {
                fetch(`/api/proxy/messages?user=${user}&conversation_id=${conversationId}`)
                    .then((res) => res.json())
                    .then((data) => {
                        if (data?.data?.length > 0) {
                            const restored = data.data
                                .map((msg: any) => [
                                    `🧑 ${msg.query}`,
                                    `😺 ${msg.answer || "[応答なし]"}`,
                                ])
                                .flat();
                            setCache((prev) => ({ ...prev, [conversationId]: restored }));
                            setMessages(restored);
                        } else {
                            setMessages(["😺 [履歴が見つかりませんでした]"]);
                        }
                    })
                    .catch((err) => {
                        setMessages([`🚫 エラー：${err.message}`]);
                    });
            }
        } else {
            setMessages([]);
        }
    }, [conversationId]);

    const handleSend = async (text: string) => {
        if (!text.trim() || sending) return;
        setSending(true);
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

        const newMessages = [
            ...messages,
            `🧑 ${text}`,
            `😺 ${data.answer || "[応答なし]"}`,
        ];
        setMessages(newMessages);

        if (!conversationId && data.conversation_id) {
            setConversationId(data.conversation_id);
            setHistory((prev) => [
                { id: data.conversation_id, name: text.slice(0, 10) },
                ...prev,
            ]);
        }
        const id = data.conversation_id || conversationId;
        if (id) setCache((prev) => ({ ...prev, [id]: newMessages }));

        setSending(false);
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white text-gray-800 px-6 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <Image src="/Sofia_logo.png" alt="Sofia Logo" width={42} height={42} className="rounded-full" />
                    <h1 className="text-3xl font-bold tracking-wide">Hello Sofia 🪷</h1>
                </div>

                <div className="mb-4 text-sm text-center">
                    <p>👤 ユーザーID: {user}</p>
                    <p>💬 会話ID: <span className="text-blue-600">{conversationId || "(なし)"}</span></p>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold mb-1">会話履歴：</label>
                    <select
                        onChange={(e) => handleSelectConversation(e.target.value)}
                        value={conversationId || "new"}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="new">🆕 新しい会話</option>
                        {history.map((h) => (
                            <option key={h.id} value={h.id}>
                                {h.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2 mb-6 bg-white rounded-xl shadow px-4 py-4 min-h-[200px] leading-relaxed tracking-wide">
                    {messages.map((m, i) => (
                        <div key={i} className="flex items-start gap-2">
                            {m.startsWith("🧑") ? (
                                <>
                                    <div className="ml-auto flex items-center gap-2">
                                        <p className="text-right text-blue-700">{m}</p>
                                        <Image src={userImageUrl} alt="User" width={32} height={32} className="rounded-full" />
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Image src="/Sofia_logo.png" alt="Sofia Logo" width={28} height={28} className="rounded-full" />
                                    <p className="text-left text-purple-700 italic">{m}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="メッセージを入力"
                        className="flex-grow p-3 border border-gray-300 rounded-md"
                    />
                    <button
                        onClick={() => handleSend(input)}
                        className="p-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition"
                    >
                        <Image src="/Sofia_logo.png" alt="Send" width={24} height={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}