import { createAuthClient } from "better-auth/react";

export const { useSession, signOut, signIn, signUp } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});