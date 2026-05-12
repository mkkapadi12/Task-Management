import z from "zod";

const createProjectSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, "Min 3 characters")
    .max(100, "Max 100 characters")
    .trim(),
  description: z
    .string({ required_error: "Description is required" })
    .min(1, "Description cannot be empty")
    .max(500, "Max 500 characters")
    .trim(),
});

const updateProjectSchema = z.object({
  title: z
    .string()
    .min(3, "Min 3 characters")
    .max(100, "Max 100 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .min(1, "Description cannot be empty")
    .max(500, "Max 500 characters")
    .trim()
    .optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

const addMemberSchema = z.object({
  userId: z
    .number({ required_error: "User ID is required" })
    .int("Must be an integer")
    .positive("Must be a positive integer"),
  role: z.enum(["ADMIN", "MEMBER"]).optional().default("MEMBER"),
});

const updateMemberRoleSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"], {
    required_error: "Role is required",
  }),
});

export {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
  updateMemberRoleSchema,
};
