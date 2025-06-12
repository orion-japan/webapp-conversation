// pages/api/proxy/test.ts

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const response = await fetch('https://api.dify.ai/v1/conversations?user=669933', {
        headers: {
            Authorization: process.env.DIFY_API_KEY || '',
        },
    });

    const data = await response.json();
    res.status(200).json(data);
}