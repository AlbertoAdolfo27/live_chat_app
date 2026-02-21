import { Message } from "../messages/message.types";
import { User } from "../users/user.types";


export type Conversation = {
    id: string;
    participants: {
        user: User
    }[],
    messages?: Message[]
}
