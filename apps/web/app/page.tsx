import Conversations from "../modules/conversations/components/conversations"
import AvailableUsers from "../modules/users/components/available-users"

export default function HomePage() {
    return (
        <>
            <AvailableUsers />
            <Conversations />
        </>
    )
}