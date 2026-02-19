export type MessageResponseDTO = {
    id: string;
    content: string;
    conversationId: string;
    sender: {
        id: string;
        name: string;
    }
}