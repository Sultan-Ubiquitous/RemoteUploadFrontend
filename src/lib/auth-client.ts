import { createAuthClient } from "better-auth/react";


export const authClient = createAuthClient({
    baseURL: "http://localhost:8008",
});


export const { useSession } = createAuthClient({
    baseURL: "http://localhost:8008",
});