import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Home() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages((prev) => [...prev, input]);
        setInput("");
    };

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-indigo-100 px-2 py-6 text-center text-gray-800">
            <h1 className="text-3xl font-bold mb-4 text-indigo-600">🌟 Hello Sofia ✨</h1>
            <div className="mb-3 text-sm text-gray-500">ユーザーID: 669933</div>
            <div
                ref={containerRef}
                className="max-w-xl mx-auto h-[60vh] overflow-y-auto bg-white shadow-md rounded-xl p-4 space-y-3 border border-indigo-100"
            >
                {messages.map((msg, i) => (
                    <div key={i} className="text-left text-violet-700 whitespace-pre-wrap leading-relaxed">
                        <span className="font-bold mr-2">🧑 User:</span>
                        {msg}
                    </div>
                ))}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
                <input
                    type="text"
                    placeholder="メッセージを入力"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full sm:flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow"
                />
                <button
                    onClick={handleSend}
                    className="flex items-center justify-center px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg shadow"
                >
                    <Image src="/Sofia_logo.png" alt="Send" width={24} height={24} />
                </button>
            </div>
        </div>
    );
}