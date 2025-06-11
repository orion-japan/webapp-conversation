const apiKey = process.env.DIFY_API_KEY;

const apiRes = await fetch(targetUrl, {
    method,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey, // ← Bearerを二重にしない
    },
    ...
});
