
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerUser as registerAction } from "@/modules/users/user.service"
import { login } from "@/modules/auth/auth.actions"

export default function Register() {
    const [error, setError] = useState("")
    const router = useRouter()

    const register = async (e: React.FormEvent<HTMLFormElement>) => {
        setError("")
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const name = formData.get("name") as string
        const username = formData.get("username") as string
        const email = formData.get("username") as string
        const password = formData.get("password") as string

        if (!name || !username || !email || !password) {
            setError("Fill in all fields")
            return
        }

        try {
            await registerAction({ name, username, password, email })
            await login({ username, password })
            router.push("/")
            //eslint-disable-next-line
        } catch (error: any) {
            setError(error.message)
        }


    }

    return (
        <div className="mx-2">
            <div className="p-2 pb-8 bg-white md:w-1/3 mx-auto my-8">
                <h1 className="text-center p-2">Register</h1>
                <form onSubmit={register} className="flex flex-col">
                    <input type="text" name="name" className="m-2 p-2 border border-gray-300" placeholder="Name" />
                    <input type="text" name="email" className="m-2 p-2 border border-gray-300" placeholder="Email" />
                    <input type="text" name="username" className="m-2 p-2 border border-gray-300" placeholder="Username" />
                    <input type="text" name="password" className="m-2 p-2 border border-gray-300" placeholder="Password" />

                    {error && <p className="text-red-400 text-center"> {error}</p>}

                    <button className="m-2 p-2 block bg-green-400 hover:bg-green-500 cursor-pointer" >Register account</button>
                </form>
            </div>
        </div>
    )
}