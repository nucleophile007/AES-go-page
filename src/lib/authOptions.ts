// src/lib/authOptions.ts
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { allowedEmails as allowedFromEnv } from "./adminConfig"

const fallbackAllowed = ["dkdps3212@gmail.com", "acharya.folsom@getMaxListeners.com"]
export const allowedEmails = allowedFromEnv.length ? allowedFromEnv : fallbackAllowed

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return allowedEmails.includes((user.email || "").toLowerCase())
    },
    async session({ session }) {
      if (session.user?.email) {
        session.user.role = allowedEmails.includes(session.user.email.toLowerCase()) ? "admin" : "user"
      }
      return session
    },
  },
}
