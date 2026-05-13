import { createHash } from 'node:crypto';

export function hashPassword(password: string) {
  // Using SHA-256 to create a secure digital fingerprint of the password
  return createHash('sha256').update(password).digest('hex');
}