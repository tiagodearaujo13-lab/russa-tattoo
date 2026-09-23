export function getAllowedAdminEmails(): string[] {
  const adminEmailsEnv = process.env.ADMIN_EMAIL ?? "";

  return adminEmailsEnv
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  const userEmail = email?.trim().toLowerCase();
  return Boolean(userEmail && getAllowedAdminEmails().includes(userEmail));
}
