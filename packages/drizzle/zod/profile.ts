import { users } from "@/schemas/auth";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const userInsertSchema = createInsertSchema(users, {
  name: (name) =>
    name
      .trim()
      .min(1, "名前は必須です")
      .max(100, "名前は100文字以内で入力してください")
      .optional(),
});
export const userSelectSchema = createSelectSchema(users);
