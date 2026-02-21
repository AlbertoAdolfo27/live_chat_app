import { getUsers } from "@/modules/users/user.service"
import Link from "next/link"
import { User } from "../user.types"
import { getLoggedUser } from "@/modules/auth/auth.service"
import { redirect } from "next/navigation"
import { getConversations } from "@/modules/conversations/conversation.service"
import { Conversation } from "@/modules/conversations/conversation.types"

export default async function AvailableUsers() {
    const loggedUser = await getLoggedUser()
    if (!loggedUser) redirect("/login")

    const usersWithoutConversations = await getUsers("without-conversation")
    const conversationsWithoutMessages = await getConversations("without-messages")

    return (
        <>
            {
                (usersWithoutConversations.length > 0 || conversationsWithoutMessages.length > 0) && (
                    <div className="mx-2">
                        <div className="md:w-1/2 mx-auto px-2 py-4 bg-white m-4">
                            <p className="text-center text-bold">Start new conversation</p>
                            <div className="flex gap-2 justify-center overflow-x-auto bg-blue-50">
                                {<ListAvailableUsers users={usersWithoutConversations} conversations={[]} loggedUser={loggedUser} />}
                                {<ListAvailableUsers users={[]} conversations={conversationsWithoutMessages} loggedUser={loggedUser} />}
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export function ListAvailableUsers({ users, conversations, loggedUser }: { users: User[], conversations: Conversation[], loggedUser: User }) {
    return (
        <>
            {
                users.map((user) => (
                    <Link href={`/conversations/start/${user.id}`} key={user.id}>
                        <div className="p-1 px-2 my-2  hover:bg-blue-100 cursor-pointer">
                            <div className="w-[55px] h-[55px] bg-gray-300 m-1 border-4 border-gray-300 mx-auto" style={{ borderRadius: 100 }}>
                            </div>
                            <p className="text-center  whitespace-nowrap">{user.name}</p>
                        </div>
                    </Link>
                ))
            }
            {
                conversations.map((conversation) => (
                    <Link href={`/conversations/${conversation.id}`} key={conversation.id}>
                        <div className="p-1 px-2 my-2  hover:bg-blue-100 cursor-pointer">
                            <div className="w-[55px] h-[55px] bg-gray-300 m-1 border-4 border-gray-300 mx-auto" style={{ borderRadius: 100 }}>
                            </div>
                            <p className="text-center  whitespace-nowrap">
                                {
                                    conversation.participants.find(participant => {
                                        return participant.user.id !== loggedUser.id
                                    })?.user.name
                                }
                            </p>
                        </div>
                    </Link>
                ))
            }
        </>
    )
}