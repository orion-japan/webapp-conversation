import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { user } = req.query;

    if (!user || typeof user !== "string") {
        return res.status(400).json({ error: "Missing user parameter" });
    }

    const apiKey = process.env.DIFY_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Missing API Key" });
    }

    // ✅ 会話履歴を最大100件まで取得（Difyの仕様上限）
    const url = `https://api.dify.ai/v1/conversations?user=${user}&limit=100`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: apiKey,
            },
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch conversation history" });
    }
}