import z from "zod";

const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, "Min 3 characters")
    .max(50, "Max 50 characters")
    .trim(),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email")
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Min 6 characters")
    .max(32, "Max 32 characters")
    .trim(),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email")
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Min 6 characters")
    .max(32, "Max 32 characters"),
});

export { registerSchema, loginSchema };
