// src/lib/authOptions.ts
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const allowedEmails = ["dkdps3212@gmail.com", "biharteacherconnect@gmail.com"]

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return allowedEmails.includes(user.email || "")
    },
    async session({ session }) {
      if (session.user?.email) {
        session.user.role = allowedEmails.includes(session.user.email) ? "admin" : "user"
      }
      return session
    },
  },
}
