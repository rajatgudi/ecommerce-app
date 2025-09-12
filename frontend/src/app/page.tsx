"use client"
import Link from "next/link";
import {useEffect, useState} from "react";
import {parseTokenFromUrl} from "@/utils";
import {getUserProfile} from "@/services/auth.service";

export default function Home() {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        // Load tokens from localStorage on client
        const storedAccess = window.localStorage.getItem('accessToken');
        const storedRefresh = window.localStorage.getItem('refreshToken');
        if (storedAccess) setAccessToken(storedAccess);
        if (storedRefresh) setRefreshToken(storedRefresh);

        // If redirected back with token in query, save it
        const {accessToken: urlAccessToken, refreshToken: urlRefreshToken} = parseTokenFromUrl();
        if (urlAccessToken) {
            window.localStorage.setItem('accessToken', urlAccessToken);
            setAccessToken(urlAccessToken);
        }
        if (urlRefreshToken) {
            window.localStorage.setItem('refreshToken', urlRefreshToken);
            setRefreshToken(urlRefreshToken);
        }
    }, []);

    useEffect(() => {
        if (!accessToken) return;
        // Fetch protected profile
        getUserProfile(accessToken)
            .then((res: any) => {
                console.log('user', res.data)

                setProfile(res.data);
                setError('');
            })
            .catch((err) => {
                setProfile(null);
                setError(err.response?.data?.message || 'Failed to fetch profile');
                // Possibly token expired — remove it
                if (typeof window !== 'undefined') {
                    window.localStorage.removeItem('accessToken');
                }
                setAccessToken(null);
            });
    }, [accessToken]);
    return (
        <div
            className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <h1 className={"text-xl"}>Hello, Welcome to Dashboard!</h1>
                <h3>Google login</h3>

                {}
                {accessToken && (
                    <>
                        <p>accessToken:{accessToken}</p>

                        {profile ? (
                            <div>
                                <h3>Profile</h3>
                                <p>Name: {profile.name || profile.name}</p>
                                <p>Sub (id): {profile.id}</p>
                            </div>
                        ) : (
                            <p>Loading profile...</p>
                        )}
                    </>
                )}

                {error && (
                    <div style={{color: 'red'}}>
                        <p>Error: {error}</p>
                    </div>
                )}
                <button><Link href="/login">Logout</Link></button>
            </main>
        </div>
    );
}
