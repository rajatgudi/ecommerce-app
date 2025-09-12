import {create} from "zustand"
import {devtools} from "zustand/middleware/devtools";
import {persist} from "zustand/middleware/persist";

type User = {
    id?: string;
    email?: string;
    name?: string;
    role?: "user" | "admin";
};

type AuthState = {
    user: User | null,
    token: string | null,
    setAuth: (user: User, token: string) => void,
    logout: () => void,
}
const authStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                user: null,
                token: null,
                setAuth: (user, token) => set({user, token}),
                logout: () => set({user: null, token: null})
            }),
            {name: 'authStore'},
        ),
    ),
)
export default authStore;