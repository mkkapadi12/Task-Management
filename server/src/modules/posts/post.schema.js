import z from "zod";

const createPostSchema = z.object({
  title: z.string().min(3, "Title min 3 chars").max(200),
  content: z.string().min(10, "Content min 10 chars"),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  tags: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return [];
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return [val];
        }
      }
      return val;
    }),
});

const updatePostSchema = createPostSchema.partial();

export { createPostSchema, updatePostSchema };
