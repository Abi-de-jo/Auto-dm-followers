function getOwnerEmails(): string[] {
  const configured = [process.env.ADMIN_EMAILS, process.env.PLATFORM_OWNER_EMAILS]
    .filter(Boolean)
    .join(",");
  return configured
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isOwnerEmail(email?: string | null): boolean {
  if (!email) return false;
  return getOwnerEmails().includes(email.toLowerCase().trim());
}
