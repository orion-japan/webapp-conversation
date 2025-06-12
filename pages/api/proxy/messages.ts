import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { user, conversation_id } = req.query;

    if (!user || !conversation_id || typeof user !== "string" || typeof conversation_id !== "string") {
        return res.status(400).json({ error: "Missing parameters" });
    }

    const apiKey = process.env.DIFY_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Missing API Key" });
    }

    try {
        const response = await fetch(
            `https://api.dify.ai/v1/messages?user=${user}&conversation_id=${conversation_id}`,
            {
                headers: {
                    Authorization: apiKey,
                },
            }
        );

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch messages" });
    }
}