"use client"
import { useState } from "react"
import { login as loginAction } from "@/modules/auth/auth.actions"
import { useRouter } from "next/navigation"
import { useSocket } from "@/lib/socket/socket.context"

export default function Login() {
    const [error, setError] = useState("")
    const router = useRouter()
    const { connect } = useSocket()

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        setError("")
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const username = formData.get("username") as string
        const password = formData.get("password") as string

        if (!username || !password) {
            setError("Missing username or password")
            return
        }

        try {
            await loginAction({ username, password })
            connect()
            router.push("/")
            //eslint-disable-next-line
        } catch (error: any) {
            setError(error.message)
        }
    }

    return (
        <div className="mx-2">
            <div className="m-2 p-2 pb-8 bg-white md:w-1/3 mx-auto my-8">
                <h1 className="text-center p-2">Login</h1>
                <form onSubmit={login} className="flex flex-col">
                    <input type="text" name="username" placeholder="username" className="m-2 p-2 border border-gray-300" />
                    <input type="text" name="password" placeholder="password" className="m-2 p-2 border border-gray-300" />

                    {error && <p className="text-red-400 text-center"> {error}</p>}

                    <button className="m-2 p-2 block bg-green-400 hover:bg-green-500 cursor-pointer" >Login</button>
                </form>
            </div>
        </div>
    )
}