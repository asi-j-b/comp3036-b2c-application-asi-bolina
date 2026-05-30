import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().max(80, "Name must be 80 characters or fewer").optional(),
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

export function sanitizeName(name: string | undefined) {
  const sanitized = (name ?? "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
  return sanitized || null;
}
