import { getLoggedUser, logout } from "@/modules/auth/auth.service"
import { getConversations } from "@/modules/conversations/conversation.service"
import Link from "next/link"

export default async function Conversations() {
    const loggedUser = await getLoggedUser()
    const conversations = await getConversations("with-messages")

    return (
        // List user conversations
        (conversations.length > 0) && (
            <div className="mx-1">
                <div className="md:w-1/2 mx-auto px-2 py-4 bg-white m-4">
                    <p className="text-center">My Conversations</p>
                    <div className="p-1">
                        {
                            conversations.map((conversation, index) => (
                                conversation.participants.map((participant) => (

                                    (participant.user.id !== loggedUser?.id) && (
                                        <Link href={`/conversations/${conversation.id}`} key={index}>
                                            <div className="p-1 my-2 bg-blue-50 hover:bg-blue-100 cursor-pointer" key={index}>
                                                <div className="w-[55px] h-[55px] bg-gray-300 m-1 border-4 border-gray-300 mx-auto" style={{ borderRadius: 100 }}>
                                                </div>

                                                <p className="text-center  whitespace-nowrap">
                                                    {
                                                        participant.user.name
                                                    }
                                                </p>
                                            </div>
                                        </Link>
                                    )
                                ))
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    )
}