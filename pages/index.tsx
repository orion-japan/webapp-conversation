// pages/index.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";

export default function Home() {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [input]);

    const handleSend = () => {
        if (!input.trim()) return;
        console.log("Send:", input);
        setInput("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-100 flex flex-col items-center p-4">
            <Head>
                <title>Hello Sofia ✨</title>
            </Head>
            <div className="w-full max-w-xl bg-white shadow-xl rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Image src="/Sofia_logo.png" alt="Sofia" width={40} height={40} />
                        <h1 className="text-2xl font-bold text-indigo-600">Hello Sofia ✨</h1>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-inner h-[400px] overflow-y-scroll text-purple-700 space-y-2">
                    <p>✨ Sofia との会話が始まりました。ここに記録が表示されます。</p>
                    <div ref={messagesEndRef} />
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="メッセージを入力"
                        className="flex-1 border border-indigo-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <button
                        onClick={handleSend}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}