import z from "zod";

const createTaskSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, "Min 3 characters")
    .max(100, "Max 100 characters")
    .trim(),
  description: z.string().max(2000, "Max 2000 characters").trim().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  deadline: z
    .string()
    .datetime({ message: "Deadline must be a valid ISO date string" })
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return new Date(val) > new Date();
      },
      { message: "Deadline must be in the future" },
    ),
  assigneeId: z
    .number()
    .int("Must be an integer")
    .positive("Must be a positive integer")
    .optional(),
});

const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Min 3 characters")
    .max(100, "Max 100 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .max(2000, "Max 2000 characters")
    .trim()
    .nullable()
    .optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  deadline: z
    .string()
    .datetime({ message: "Deadline must be a valid ISO date string" })
    .nullable()
    .optional(),
  assigneeId: z
    .number()
    .int("Must be an integer")
    .positive("Must be a positive integer")
    .nullable()
    .optional(),
});

export { createTaskSchema, updateTaskSchema };
