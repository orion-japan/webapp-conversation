"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Home() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string>("unknown");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const user = params.get("user");
        if (user) setUserId(user);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const res = await fetch("/api/proxy/chat-messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                inputs: {},
                query: input,
                response_mode: "blocking",
                conversation_id: conversationId,
                user: userId,
            }),
        });
        const data = await res.json();
        const newId = data.conversation_id;
        setConversationId(newId);
        setMessages((prev) => [
            ...prev,
            `🧑 ${input}`,
            `😺 ${data.answer || "[応答なし]"}`,
        ]);
        setInput("");
    };

    return (
        <main className="flex flex-col items-center justify-start min-h-screen py-6 px-4 bg-gradient-to-b from-white to-indigo-50">
            <h1 className="text-2xl font-bold mb-4">🌟 Hello Sofia 🌟</h1>
            <p className="mb-2">👤 ユーザーID: {userId}</p>
            <p className="mb-2">💬 会話ID: {conversationId || "(なし)"}</p>

            <div className="message-container w-full max-w-md">
                {messages.map((msg, i) => (
                    <p
                        key={i}
                        className={msg.startsWith("🧑") ? "user-message" : "sofia-message"}
                    >
                        {msg}
                    </p>
                ))}
                <div ref={messagesEndRef} className="scroll-indicator">⇩ 最新</div>
            </div>

            <div className="flex items-center gap-2 mt-4 w-full max-w-md">
                <input
                    type="text"
                    className="chat-input flex-1"
                    placeholder="メッセージを入力"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={handleSend} className="send-button">
                    <Image src="/Sofia_logo.png" alt="Send" width={24} height={24} />
                </button>
            </div>
        </main>
    );
}