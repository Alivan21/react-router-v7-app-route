/**
 * Calculate maxAge in seconds for cookie expiration
 * @param expiresAt - ISO date string, timestamp, Date object, or JWT exp (seconds since epoch)
 * @returns maxAge in seconds
 */
export function calculateMaxAge(expiresAt?: string | number | Date): number {
  if (!expiresAt) {
    // Default to 7 days if no expiry provided
    return 7 * 24 * 60 * 60;
  }

  let expiryTime: number;

  if (typeof expiresAt === "number") {
    // JWT exp is in seconds, convert to milliseconds
    expiryTime = expiresAt > 9999999999 ? expiresAt : expiresAt * 1000;
  } else if (typeof expiresAt === "string") {
    expiryTime = new Date(expiresAt).getTime();
  } else {
    expiryTime = expiresAt.getTime();
  }

  const now = Date.now();
  const maxAge = Math.floor((expiryTime - now) / 1000);

  // Return maxAge, minimum 0
  return Math.max(0, maxAge);
}
