import { User } from "../users/user.types";

export type Message = {
    id: string;
    conversationId: string;
    content: string;
    createAt: string;
    sender: User
}