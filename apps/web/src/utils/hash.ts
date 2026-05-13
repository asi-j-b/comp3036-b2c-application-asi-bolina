import { createHash } from 'node:crypto';

/**
 * Creates a SHA-256 hash of a password for secure comparison.
 * Design Choice: We use node:crypto to ensure passwords are never 
 * compared as plain-text in server memory.
 */
export function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex');
}