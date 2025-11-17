import crypto from "crypto";

/**
 * Generate a secure random verification token
 */
export function generateVerificationToken(): string {
  // Generate 32 bytes of random data and convert to hex string (64 characters)
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Hash a token for secure storage
 * Using SHA-256 for simplicity (can upgrade to bcrypt if needed)
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Verify a token against a hashed token
 */
export function verifyToken(hashedToken: string, inputToken: string): boolean {
  const inputHash = hashToken(inputToken);
  return crypto.timingSafeEqual(
    Buffer.from(hashedToken),
    Buffer.from(inputHash)
  );
}

/**
 * Generate token expiry date (24 hours from now)
 */
export function getTokenExpiryDate(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);
  return expiry;
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(expiresAt: Date | string): boolean {
  const expiryDate = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  return expiryDate < new Date();
}

