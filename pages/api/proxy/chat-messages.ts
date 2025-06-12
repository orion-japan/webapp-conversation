import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const apiKey = process.env.DIFY_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Missing Dify API key" });
    }

    try {
        const targetUrl = "https://api.dify.ai/v1/chat-messages";

        const response = await fetch(targetUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: apiKey,  // ✅ 修正箇所
            },
            body: JSON.stringify(req.body),
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: await response.text() });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (err: any) {
        return res.status(500).json({ error: err.message || "Unknown error" });
    }
}