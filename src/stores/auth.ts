import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
// @ts-ignore
import type {} from '@redux-devtools/extension' // required for devtools typing
import { User } from "firebase/auth";

interface AuthState {
    isLoggedIn: boolean,
    authenticatedUser: User | null,
    setLoggedInState: (loggedInState: boolean) => void,
    setAuthenticatedUser: (user: User | null) => void
}

const useAuthStore = create<AuthState>() (
    devtools(
        persist(
            (set) => ({
                isLoggedIn: false,
                authenticatedUser: null,
                setLoggedInState: (loggedInState: boolean) => set(() => ({
                    isLoggedIn: loggedInState
                })),
                setAuthenticatedUser: (user: User | null) => set(() => ({
                    authenticatedUser: user
                }))
            }),
            {
                name: 'auth-store'
            }
        )
    )
)

export default useAuthStore