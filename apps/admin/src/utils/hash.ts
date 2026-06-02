import argon2 from "argon2";

export function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password);
}