import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { user, conversation_id, first_id, limit = 20 } = req.query;

    const apiKey = process.env.DIFY_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Missing Dify API key" });
    }

    try {
        const url = new URL("https://api.dify.ai/v1/messages");
        url.searchParams.append("user", String(user));
        url.searchParams.append("conversation_id", String(conversation_id));
        if (first_id) {
            url.searchParams.append("first_id", String(first_id));
        }
        url.searchParams.append("limit", String(limit));

        const apiRes = await fetch(url.toString(), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        if (!apiRes.ok) {
            return res.status(apiRes.status).json({ error: await apiRes.text() });
        }

        const data = await apiRes.json();
        return res.status(200).json(data);
    } catch (err: any) {
        return res.status(500).json({ error: err.message || "Unknown error" });
    }
}