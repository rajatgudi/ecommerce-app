"use client"
import Link from "next/link";

export default function Page() {
    return <div>
        <h1 className={"text-xl"}>Hello, Welcome to Dashboard!</h1>
        <button><Link href="/login">Logout</Link></button>
    </div>
}