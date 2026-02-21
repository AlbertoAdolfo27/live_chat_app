"use client"
import { SOCKET_BASE_URL } from "@/config/config";
import { getLoggedUser } from "@/modules/auth/auth.service";
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { Socket, io } from "socket.io-client";

export type SocketContextType = {
    connect: () => void;
    disconnect: () => void;
    socket: Socket | null;
    isConnected: boolean
}

export const useSocket = () => useContext(SocketContext)

export const SocketContext = createContext<SocketContextType>({
    connect: () => { },
    disconnect: () => { },
    socket: null,
    isConnected: false
})

export function SocketProvider({ children }: { children: ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [id, setId] = useState<string | null>(null)

    const connect = () => {
        getLoggedUser()
            .then(user => {
                const accessToken = user?.accessToken
                if (!accessToken) {
                    disconnect()
                    return
                }

                if (socket) return
                const socketInstance = io(SOCKET_BASE_URL, {
                    transports: ["websocket"],
                    reconnection: true,
                    reconnectionDelay: 1000,
                    auth: {
                        token: accessToken
                    }
                })

                setSocket(socketInstance)

                socketInstance.on("connect", () => {
                    setIsConnected(true)
                    setSocket(socketInstance)
                    console.log("Socket connected:", socketInstance.id)
                })

                socketInstance.on("disconnect", () => {
                    setIsConnected(false)
                    setSocket(null)
                    console.log("Socket disconnected")
                })

                socketInstance.on("connect_error", () => {
                    console.log("Error on connect socket")
                })
            })
            .catch(() => disconnect())
    }

    const disconnect = () => {
        if (socket) {
            socket.disconnect()
        }
        setSocket(null)
        setIsConnected(false)
    }

    useEffect(() => {
        connect()
        return () => {
            disconnect()
        }
    }, [])


    return (
        <SocketContext.Provider value={
            {
                connect,
                disconnect,
                socket,
                isConnected
            }
        }>
            {children}
        </SocketContext.Provider>
    )

}