export const allowedEmails: string[] = (process.env.ADMIN_ALLOWED_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean)
