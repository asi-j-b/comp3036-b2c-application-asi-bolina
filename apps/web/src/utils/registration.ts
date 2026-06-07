import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(60, "First name must be 60 characters or fewer"), // Aligned with your form limit
    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(60, "Last name must be 60 characters or fewer"), // Aligned with your form limit
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Enter a valid email address")
      .max(254, "Email must be 254 characters or fewer"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(60, "Password must be 60 characters or fewer") // Aligned with your form limit
      // 🟢 The uppercase and lowercase constraints have been removed here to match your form checkboxes
      .regex(/[0-9]/, "Password must include a number")
      .regex(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, "Password must include a special character"),
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