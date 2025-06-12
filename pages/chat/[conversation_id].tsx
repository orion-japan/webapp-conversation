// pages/chat/[conversation_id].tsx
import { useRouter } from 'next/router';
import Chat from '@/components/chat';

export default function ChatPage() {
    const router = useRouter();
    const { conversation_id } = router.query;

    if (!conversation_id || typeof conversation_id !== 'string') return null;

    return <Chat conversationId={conversation_id} />;
}