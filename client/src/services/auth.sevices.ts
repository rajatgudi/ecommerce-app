import api from "../lib/axios"

type LoginPayload = { email: string; password: string };
type RegisterPayload = { name?: string; email: string; password: string };
type ResetPasswordPayload = { token: string; password: string };

type AuthResponse = {
    message?: string;
    user: { id: string; email: string; name?: string; role?: "user" | "admin" };
    accessToken: string;
    refreshToken: string;
};

export interface SignInResponse {
    message: string
    user: User
    accessToken: string
    refreshToken: string
}

export interface ResetPasswordResponse {
    message?: string
}

export interface User {
    id: string
    email: string
    name: string
    role: string
    googleId: string
    is_email_verified: boolean
    createdAt: string
    updatedAt: string
}

export const login = async (payload: LoginPayload): Promise<SignInResponse> => {
    const response = await api.post<SignInResponse>("/login", payload)
    return response.data
}

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/register", payload)
    return response.data
}
export const forgotPassword = async (payload: { email: string }) => {
    const response = await api.post("/forgot-password", payload)
    return response.data
}
export const resetPassword = async (payload: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
    const response = await api.post<ResetPasswordResponse>("/reset-password", payload)
    return response?.data
}
export const googleSignIn = async () => {
    // Initiate OAuth by redirecting the browser to the backend auth endpoint
    if (typeof window !== 'undefined') {
        const base = (api.defaults.baseURL ?? '').replace(/\/$/, '')
        window.location.href = `${base}/google`
    }
}
export const getUserProfile = async (token: string) => {
    const response = await api.get("/google/profile", {
        headers: {Authorization: `Bearer ${token}`}
    })
    return response.data
}
