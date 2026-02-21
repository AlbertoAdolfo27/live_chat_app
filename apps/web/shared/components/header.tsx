
import { checkUserAuthentication, getLoggedUser } from "@/modules/auth/auth.service";
import HeaderClient from "./header-client";

export default async function Header() {
    const isUserLogged = await checkUserAuthentication()
    const loggedUser = await getLoggedUser()

    const loggedUserFullname = (loggedUser) ? loggedUser.name : ""

    return <HeaderClient props={{ isUserLogged, loggedUserFullname }} />
}