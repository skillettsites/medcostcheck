const TOKEN_LENGTH = 12;

export function deriveReportToken(stripeSessionId: string | null | undefined): string | null {
  if (!stripeSessionId) return null;
  const trimmed = stripeSessionId.trim();
  if (trimmed.length < TOKEN_LENGTH) return null;
  return trimmed.slice(-TOKEN_LENGTH);
}

export function isValidReportToken(token: string | null | undefined): token is string {
  if (!token) return false;
  if (token.length !== TOKEN_LENGTH) return false;
  return /^[A-Za-z0-9]+$/.test(token);
}

export function buildReportUrl(
  stripeSessionId: string | null | undefined,
  origin = process.env.NEXT_PUBLIC_SITE_URL || "https://www.medcostcheck.com"
): string | null {
  const token = deriveReportToken(stripeSessionId);
  if (!token) return null;
  return `${origin.replace(/\/$/, "")}/r/${token}`;
}
