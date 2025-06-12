// pages/api/proxy/conversations.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const apiKey = process.env.DIFY_API_KEY;
    if (!apiKey) {
        return res.status(400).json({ error: "Missing DIFY_API_KEY in env" });
    }

    const { user } = req.query;

    if (!user || typeof user !== "string") {
        return res.status(400).json({ error: "Missing or invalid 'user' parameter" });
    }

    const query = new URLSearchParams({
        user: user,
        limit: "20",
        sort_by: "-updated_at",
    });

    try {
        const response = await fetch(`https://api.dify.ai/v1/conversations?${query.toString()}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}