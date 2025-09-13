import {create} from "zustand"
import {devtools, persist} from "zustand/middleware";


type User = {
    id?: string;
    email?: string;
    name?: string;
    role?: "user" | "admin";
};

export type AuthState = {
    user: User | null,
    isAuthenticated: null | boolean,
    token: string | null,
    refresh_token: string | null,
    setIsAuthenticated: (isAuthenticated: boolean) => void,
    setAuth: (user: User | null, token: string) => void,
    setToken: (accessToken: string | null, refreshToken: string | null) => void,
    logout: () => void,
}
const authStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                isAuthenticated: false,
                user: null,
                token: null,
                refresh_token: null,
                setIsAuthenticated: (isAuthenticated: boolean) => set({isAuthenticated: isAuthenticated}),
                setToken:
                    (accessToken: string | null, refreshToken: string | null) => set({
                        refresh_token: refreshToken,
                        token: accessToken
                    }),
                setAuth:
                    (user, token) => set({user, token}),
                logout:
                    () => set({user: null, token: null})
            }),
            {
                name: 'authStore'
            }
            ,
        ),
    ),
)
export default authStore;