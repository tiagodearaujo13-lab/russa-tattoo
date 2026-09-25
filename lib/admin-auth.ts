export function getAllowedAdminEmails(): string[] {
  const adminEmailsEnv = process.env.ADMIN_EMAIL ?? "";

  return adminEmailsEnv
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function getAdminNotificationEmails(officialEmail: string): string[] {
  return Array.from(
    new Set([
      ...getAllowedAdminEmails(),
      officialEmail.trim().toLowerCase(),
    ])
  );
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  const userEmail = email?.trim().toLowerCase();
  return Boolean(userEmail && getAllowedAdminEmails().includes(userEmail));
}
