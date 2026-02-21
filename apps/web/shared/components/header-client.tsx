
"use client"
import { useSocket } from "@/lib/socket/socket.context";
import { logout } from "@/modules/auth/auth.service"
import Link from "next/link";
import { redirect } from "next/navigation"

type ClientHeaderProps = {
    props: {
        isUserLogged: boolean;
        loggedUserFullname: string
    }
}

export default function HeaderClient({ props }: ClientHeaderProps) {
    const { disconnect } = useSocket()
    
    async function handleLogout() {
        await logout()
        disconnect()
        redirect("/")
    }

    const { isUserLogged, loggedUserFullname } = props

    return (
        <nav className="header">
            <ul className="">
                <Link href={"/"}>
                    <li>Home</li>
                </Link>
            </ul>
            <ul className="flex gap-2">
                {
                    (isUserLogged) ? (
                        <>
                            <li className="self-center text-green-600">{loggedUserFullname}</li>
                            <li >
                                <button id="login-btn" onClick={handleLogout} className="bg-red-400 hover:bg-red-600 p-2 rounded-md cursor-pointer">Logout</button>
                            </li>
                        </>
                    ) : (
                        <li className="gap-2 flex">
                            <Link href={"/register"}>
                                <button id="register-btn" className="bg-gray-400 hover:bg-gray-600 p-2 rounded-md cursor-pointer text-white">Register</button>
                            </Link>
                            <Link href={"/login"}>
                                <button id="login-btn" className="bg-green-400 hover:bg-green-600 p-2 rounded-md cursor-pointer">Login</button>
                            </Link>
                        </li>
                    )
                }
            </ul>

        </nav>
    )
}