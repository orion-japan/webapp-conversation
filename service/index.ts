export async function fetchConversations(user: string) {
    const res = await fetch(`/api/proxy/conversations?user=${user}`);
    const data = await res.json();
    return data.data;
}

export async function fetchMessages(conversationId: string) {
    const res = await fetch(`/api/proxy/messages?conversation_id=${conversationId}`);
    const data = await res.json();
    return data.data;
}

export async function sendMessage(payload: any) {
    const res = await fetch('/api/proxy/chat-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return await res.json();
}
