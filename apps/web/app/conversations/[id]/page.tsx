import { getLoggedUser } from "@/modules/auth/auth.service"
import Conversation from "@/modules/conversations/components/conversation"
import { getConversation } from "@/modules/conversations/conversation.service"
import { redirect } from "next/navigation"

export default async function ConversationPage({ params }: { params: { id: string } }) {
    const loggedUser = await getLoggedUser()
    if (!loggedUser) return redirect("/login")

    params = await params
    const conversationId = params.id
    const conversation = await getConversation(conversationId)
    const secondUser = conversation?.participants.find(participant => participant.user.id !== loggedUser.id)?.user

    if (!conversation || !secondUser) {
        redirect("/")
    }

    return <Conversation conversation={conversation} loggedUser={loggedUser} secondUser={secondUser} />
}