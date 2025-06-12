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

    const url = `https://api.dify.ai/v1/conversations?user=${user}`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch conversation history" });
    }
}