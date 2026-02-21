"use client"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { LoggedUser } from "./auth.types"
import { getLoggedUser } from "./auth.service"

export const LoggedUserContext = createContext<LoggedUser | null>(null)

export const useLoggedUser = () => useContext(LoggedUserContext)

export function LoggedUserProvider({ children }: { children: ReactNode }) {
    const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null)

    useEffect(() => {
        getLoggedUser().then(user => {
            setLoggedUser(user)
        }).catch()
    }, [])

    return (
        <LoggedUserContext.Provider value={loggedUser}>
            {children}
        </LoggedUserContext.Provider>
    )
}

