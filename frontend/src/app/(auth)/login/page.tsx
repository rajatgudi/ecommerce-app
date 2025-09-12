"use client"
import Link from "next/link";
import {useRouter} from 'next/navigation'
import React from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {googleSignIn, login} from "@/services/auth.service";


function getErrorMessage(err: unknown): string {
    if (typeof err === 'string') return err;
    if (err && typeof err === 'object') {
        const rec = err as Record<string, unknown>;
        const resp = rec['response'] as Record<string, unknown> | undefined;
        const data = resp?.['data'] as Record<string, unknown> | undefined;
        const msg = (data?.['error'] ?? rec['message']);
        if (typeof msg === 'string') return msg;
    }
    return 'Login failed';
}

export default function Page() {
    //Access the client
    const queryClient = useQueryClient()

    const router = useRouter();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    //mutations
    const mutation = useMutation({
        mutationFn: login,
        onSuccess: async (data) => {
            console.log('data', data)
            alert("Logged in successfully")
            // router.push('/dashboard');
        },
        onError: async (error) => {
            console.log(error)

        }
    })

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }
        mutation.mutate({
            email,
            password
        })
    }
    const handleGoogleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        await googleSignIn()
    }
    const errorMessage = mutation.isError ? getErrorMessage(mutation.error) : null;
    return <div
        className={"flex flex-col  row-start-2 items-center justify-center min-h-screen p-8 pb-20 gap-4 sm:p-20"}>
        <h1>Hello, Sign in page!</h1>
        <form onSubmit={handleLogin} className={"flex flex-col justify-center align-center gap-y-2"}>
            <input
                className={"p-2 w-[400] rounded-md border-2"}
                placeholder={"Enter your email"}
                type="email"
                value={email} required={true}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className={"p-2 w-[400] rounded-md border-2"}
                placeholder={"Enter your password"}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className={"bg-blue-500 text-white rounded-md px-4 py-2 font-bold cursor-pointer"}
                    type={"submit"} disabled={mutation.isPending}> {mutation.isPending ? 'Logging in...' : 'Login'}
            </button>
            {mutation.isError && (
                <p className="text-red-600 text-sm">{errorMessage}</p>
            )}
        </form>
        <button type={"button"} className={"cursor-pointer font-bold hover:opacity-75"}>forgot password?</button>
        <h4>if dont have an account ?</h4>
        <button className={"bg-blue-500 text-white rounded-md px-4 py-2 font-bold cursor-pointer"}>
            <Link href="/register">Register</Link>
        </button>
        <button className={"bg-red-700 text-white rounded-md px-4 py-2 font-bold cursor-pointer"}
                onClick={handleGoogleSignIn}>
            Google Sign in
        </button>
    </div>
}