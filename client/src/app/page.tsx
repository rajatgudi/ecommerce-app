"use client";
import Link from "next/link";
import {useEffect, useState} from "react";
import {parseTokenFromUrl} from "@/utils";
import {getUserProfile} from "@/services/auth.sevices";
import authStore, {AuthState} from "@/store/auth.store";
import {useRouter} from "next/navigation";
import AuthWrapper from "@/wrapper/AuthWrapper";

export default function Home() {
    const [error, setError] = useState("");
    const {user, isAuthenticated, setAuth, setToken, token, setIsAuthenticated} = authStore((state: AuthState) => state)
    const router = useRouter()
    console.log("auth", {user, isAuthenticated, token})
    useEffect(() => {
        debugger
        if (isAuthenticated == null) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        // Load tokens from localStorage on client
        const storedAccess = window.localStorage.getItem("accessToken");
        const storedRefresh = window.localStorage.getItem("refreshToken");

        // If redirected back with token in query, save it
        const {accessToken: urlAccessToken, refreshToken: urlRefreshToken} =
            parseTokenFromUrl();
        if (urlAccessToken) {
            window.localStorage.setItem("accessToken", storedAccess || urlAccessToken);
            fetchUserProfile(urlAccessToken);
        }
        if (urlRefreshToken) {
            window.localStorage.setItem("refreshToken", storedRefresh || urlRefreshToken);
        }
        if (urlRefreshToken || urlAccessToken) {
            setToken(urlAccessToken, urlRefreshToken)
            setIsAuthenticated(true)

        }
    }, []);

    const fetchUserProfile = (token: string) => {
        // Fetch protected profile
        getUserProfile(token)
            .then((res) => {
                console.log("user", res.data);
                setAuth(res.data, token)
                setError("");
            })
            .catch((err) => {
                setAuth(null, token);
                setError(err.response?.data?.message || "Failed to fetch profile");
                // Possibly token expired — remove it
                if (typeof window !== "undefined") {
                    window.localStorage.removeItem("accessToken");
                }
            });
    }

    if (!isAuthenticated)
        return null
    return (
        <div>
            <AuthWrapper><h1 className={"text-xl   text-blue-800     "}>Hello, Welcome to Dashboard!</h1>
                <h3>Google login</h3>

                {JSON.stringify(isAuthenticated)}
                {token && (
                    <>

                        {user ? (
                            <div>
                                <h3>Profile</h3>
                                <p>Name: {user?.name}</p>
                                <p>Sub (id): {user.id}</p>
                            </div>
                        ) : (
                            <p>Loading profile...</p>
                        )}
                    </>
                )}

                {error && (
                    <div style={{color: "red"}}>
                        <p>Error: {error}</p>
                    </div>
                )}

            </AuthWrapper>
        </div>
    );
}
