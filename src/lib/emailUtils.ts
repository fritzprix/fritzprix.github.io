/**
 * Decodes an obfuscated email string (e.g. base64 encoded) or returns it as-is if already plain.
 */
export function decodeEmail(obfuscated: string): string {
  if (!obfuscated) return '';
  if (obfuscated.includes('@')) return obfuscated;
  try {
    const decoded = atob(obfuscated);
    if (decoded.includes('@')) {
      return decoded;
    }
  } catch {
    // Fallback if decoding fails
  }
  return obfuscated;
}

/**
 * Obfuscates an email address for display (e.g., "72ave2@gmail.com" -> "72***@gmail.com").
 */
export function maskEmail(email: string): string {
  const plain = decodeEmail(email);
  if (!plain.includes('@')) return plain;
  const [user, domain] = plain.split('@');
  if (user.length <= 2) {
    return `${user}***@${domain}`;
  }
  return `${user.slice(0, 2)}***@${domain}`;
}
