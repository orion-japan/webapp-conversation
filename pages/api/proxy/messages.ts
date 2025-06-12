// pages/api/proxy/chat-messages.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const apiKey = process.env.DIFY_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiKey || !baseUrl) {
        return res.status(500).json({ error: "Missing API key or base URL" });
    }

    try {
        const response = await fetch(`${baseUrl}/chat-messages`, {
            method: "POST",
            headers: {
                Authorization: apiKey, // ここで "Bearer " 含めている場合はそのまま
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: "Unexpected error", details: err });
    }
}