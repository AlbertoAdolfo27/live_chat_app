import { SocketProvider } from "@/lib/socket/socket.context"
import { getLoggedUser } from "@/modules/auth/auth.service"
import Conversation from "@/modules/conversations/components/conversation"
import { getConversationWithUser } from "@/modules/conversations/conversation.service"
import { getUser } from "@/modules/users/user.service"
import { redirect } from "next/navigation"

export default async function StartConversationPage({ params }: { params: { userid: string } }) {
    const loggedUser = await getLoggedUser()
    if (!loggedUser) return redirect("/login")

    params = await params
    const secondUserId = params.userid
    let conversation = null

    let secondUser
    try {
        secondUser = await getUser(secondUserId)
    } catch (error) {
        secondUser = null
    }

    if (!secondUser) redirect("/")

    let usersConversation
    try {
        usersConversation = await getConversationWithUser(secondUserId)
        console.log(usersConversation)
        conversation = usersConversation
        
    } catch (error) {
        redirect("/")
    }

    return <Conversation conversation={conversation} loggedUser={loggedUser} secondUser={secondUser} />
}