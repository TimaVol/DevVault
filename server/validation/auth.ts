import { z } from "zod";
import { LIMITS } from "@/server/validation/limits";

export const emailField = z
  .string()
  .email("Invalid email address")
  .max(LIMITS.email, "Email is too long");

export const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(LIMITS.password, "Password is too long")
  .regex(/[a-zA-Z]/, "Password must contain a letter")
  .regex(/[0-9]/, "Password must contain a number");

export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
