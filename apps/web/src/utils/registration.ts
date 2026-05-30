import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(40, "First name must be 40 characters or fewer"),
    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(40, "Last name must be 40 characters or fewer"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Enter a valid email address")
      .max(254, "Email must be 254 characters or fewer"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be 128 characters or fewer")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/[0-9]/, "Password must include a number")
      .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

function sanitizeNamePart(name: string) {
  const sanitized = (name ?? "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
  return sanitized;
}

export function getDisplayName(firstName: string, lastName: string) {
  return `${sanitizeNamePart(firstName)} ${sanitizeNamePart(lastName)}`.trim();
}
