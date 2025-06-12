// pages/api/proxy/chat-messages.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const apiKey = process.env.DIFY_API_KEY;
    if (!apiKey) {
        return res.status(400).json({ error: "Missing DIFY_API_KEY in env" });
    }

    try {
        const response = await fetch("https://api.dify.ai/v1/chat-messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}