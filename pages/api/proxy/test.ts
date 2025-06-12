// pages/api/proxy/test.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const apiKey = process.env.DIFY_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Missing API Key in .env.local" });
    }

    const response = await fetch("https://api.dify.ai/v1/conversations", {
        method: "GET",
        headers: {
            Authorization: apiKey,
        },
    });

    const json = await response.json();
    return res.status(response.status).json(json);
}