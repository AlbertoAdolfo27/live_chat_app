"use client"
import { Conversation as ConversationType } from "../conversation.types"
import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { User } from "@/modules/users/user.types"
import { useSocket } from "@/lib/socket/socket.context"
import * as messageService from "@/modules/messages/message.service"
import { SocketResponse, SocketSuccessResponse } from "@/lib/socket/socket.types"
import { Message } from "@/modules/messages/message.types"
import { startConversation } from "../conversation.service"
import { useRouter } from "next/navigation"
import BackButton from "@/shared/components/back-button"

type ConversationProps = {
    conversation: ConversationType | null;
    loggedUser: User,
    secondUser: User
}

export default function Conversation({ conversation, loggedUser, secondUser }: ConversationProps) {
    const { socket, isConnected } = useSocket()

    const router = useRouter()

    const conversationId = conversation?.id ?? ""

    const [error, setError] = useState("")
    const [messages, setMessages] = useState<Message[]>(conversation?.messages ?? [])
    const [scrollBehavior, setScrollBehavior] = useState<"smooth" | "instant">("instant")

    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const messageBoxRef = useRef<HTMLTextAreaElement>(null)

    const SEND_MESSAGE_ERROR = "An error occurred: The message has not been sent"

    useEffect(() => {
        console.log("isConnected:", isConnected)

        if (socket) {
            socket.on("message:received", (response: SocketSuccessResponse) => {
                const newMessage: Message = response.data.message
                if (newMessage.conversationId === conversationId) setMessages(prev => [...prev, newMessage])
            })
        }

        return () => {
            if (socket) socket.off("message:received")
        }
    }, [isConnected])


    useLayoutEffect(() => {
        messagesContainerRef.current?.lastElementChild?.scrollIntoView({ behavior: scrollBehavior })
        return () => {
            setScrollBehavior("smooth")
        }
    }, [messages])

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        setError("")
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const message = String(formData.get("message") || "")
        if (!message) return

        if (!conversation) {
            // Start conversation
            const conversationStarted = await startConversation(secondUser.id, message)
            if (!conversationStarted) return setError(SEND_MESSAGE_ERROR)

            router.push(`/conversations/${conversationStarted.id}`)
            return
        }
        if (socket && isConnected) {
            const body = {
                messageContent: message,
                conversationId: conversationId
            }

            socket.emit("message:send", body, (response: SocketResponse) => {
                if (response.status === "error") {
                    console.log("Error on send message", response.error)
                    setError(SEND_MESSAGE_ERROR)
                    return
                }
                const messageSent: Message = response.data.message
                if (messageSent.conversationId === conversationId) setMessages(prev => [...prev, messageSent])
                if (messageBoxRef.current) messageBoxRef.current.value = ""
            })

        } else {
            const messageSent: Message | null = await messageService.sendMessage(conversationId, message)

            if (!messageSent) return setError(SEND_MESSAGE_ERROR)

            setMessages(prev => [...prev, messageSent])
            if (messageBoxRef.current) messageBoxRef.current.value = ""
        }
    }

    return (
        <>
            {
                <div className="mx-2">
                    <div className="md:w-1/3 mx-auto max-h-screen overflow-y-hidden py-2">
                        <div className="bg-white max-h-screen">
                            <div className="flex  items-center border-b-2 border-solid border-blue-200 p-1 bg-blue-100 justify-between">
                                <div className="flex gap-2 items-center">
                                    <div className="w-[55px] h-[55px] bg-gray-300" style={{ borderRadius: "100%" }}></div>
                                    <h1 className="font-bold">{secondUser?.name}</h1>
                                </div>
                                <BackButton />
                            </div>
                            <div className=" h-100 overflow-x-auto  px-2" ref={messagesContainerRef}>
                                {
                                    (messages.length < 1) && (
                                        <div className="bg-gray-100 m-3 py-3 px-2 text-center rounded-md text-gray-500">Escreva uma mensagem para <span className="font-bold">{secondUser.name}</span></div>
                                    )
                                }
                                {
                                    messages.map((message) => (
                                        <div key={message.id} className={`flex ${(message.sender.id === loggedUser.id) ? "justify-end" : "justify-start"}`}>
                                            {
                                                message.sender.id !== loggedUser.id && (
                                                    <div>
                                                        <div className="w-[30px] h-[30px] bg-blue-200 mt-2 ms-1 justify-center flex items-center" style={{ borderRadius: "100%" }}>
                                                            <span className="text-center">{message.sender.name[0].toUpperCase()}</span>
                                                        </div>
                                                    </div>

                                                )
                                            }
                                            <div className={`rounded  m-2 ms-1 px-3 py-3 ${(message.sender.id === loggedUser.id) ? "bg-green-200" : "bg-blue-200"}`} >
                                                <div className={`${(message.sender.id === loggedUser.id) ? "text-start" : "text-start"}`}>
                                                    {message.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <form onSubmit={sendMessage} method="post">
                                <div className="flex py-3 px-3">
                                    <textarea ref={messageBoxRef} name="message" id="message" rows={1} className="p-2 w-full border border-gray-200 rounded focus:outline-0 focus:border-gray-300"></textarea>
                                    <button type="submit" className="cursor-pointer bg-green-400 rounded px-4 ms-1">Enviar</button>
                                </div>
                                {
                                    (error) && (<p className="text-center p2-2 bg-red-200 mx-3">{error}</p>)
                                }
                            </form>

                        </div>
                    </div>
                </div>
            }
        </>
    )
}
