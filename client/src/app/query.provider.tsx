"use client"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React from "react";

// Create QueryClient on the client only to avoid passing class instances from server to client
export default function QueryProviders({children}: { children: React.ReactNode }) {
    const [queryClient] = React.useState(() => new QueryClient({}));
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
