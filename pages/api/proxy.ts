const apiRes = await fetch('https://api.dify.ai/v1/chat-messages', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.DIFY_API_KEY ?? '',
    },
    body: JSON.stringify(req.body),
});
