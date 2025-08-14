import { withAuth } from "next-auth/middleware"
import { allowedEmails } from "@/lib/authOptions"

export default withAuth({
  callbacks: {
    authorized({ token }) {
      // Only allow if logged in AND email is in allowed list
      if (!token?.email) return false
      return allowedEmails.includes(token.email as string)
    },
  },
})

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
