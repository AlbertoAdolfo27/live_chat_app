export type ConversationResponseDTO = {
    id: string;
    createdAt: Date;
    startedByUser: User;
    participants: Participant[];
    messages?: Message[]
}


type User = {
    id: string;
    name: string
}

type Participant = {
    id: string;
    joinedAt: Date;
    user: User
}

type Message = {
    id: string;
    content: string;
    createdAt: Date;
    sender: User;
}