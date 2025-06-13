import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { user, conversation_id } = req.query;
    if (!user || !conversation_id || typeof user !== "string" || typeof conversation_id !== "string") {
        return res.status(400).json({ error: "Missing parameters" });
    }

    // .envやVercelのDIFY_API_KEYは「app-xxxxxx」型だけ
    const apiKey = process.env.DIFY_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Missing API Key" });
    }

    try {
        const response = await fetch(
            `https://api.dify.ai/v1/messages?user=${encodeURIComponent(user)}&conversation_id=${encodeURIComponent(conversation_id)}`,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );

        const data = await response.json();

        // "data"配列から「user→assistant」ペア形式にmessages化（オプション）
        let processedMessages: any[] = [];
        if (Array.isArray(data.data)) {
            data.data.forEach((msg: any) => {
                if (msg.query && msg.query.trim()) {
                    processedMessages.push({
                        id: msg.id + "_user",
                        role: "user",
                        content: msg.query,
                        created_at: msg.created_at,
                    });
                }
                if (msg.answer && msg.answer.trim()) {
                    processedMessages.push({
                        id: msg.id + "_assistant",
                        role: "assistant",
                        content: msg.answer,
                        created_at: msg.created_at,
                    });
                }
            });
        }

        return res.status(response.status).json({
            messages: processedMessages,
            raw: data, // デバッグ用：必要なら消してOK
        });
    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch messages" });
    }
}