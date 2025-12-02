import z from "zod";
import { users } from "../schemas/auth";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const nameSchema = z
  .string()
  .trim()
  .min(1, "名前を入力してください")
  .max(100, "名前は100文字以内で入力してください");
export const usernameSchema = z
  .string()
  .trim()
  .min(3, "ユーザー名は3文字以上で入力してください")
  .max(20, "ユーザー名は20文字以内で入力してください")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "ユーザー名は英数字、ハイフン、アンダースコアのみ使用できます"
  );

export const profileUpdateSchema = createUpdateSchema(users, {
  name: nameSchema,
  username: usernameSchema,
  image: z.string().url(),
}).omit({
  id: true,
  email: true,
  emailVerified: true,
  isAnonymous: true,
  role: true,
  banned: true,
  banReason: true,
  banExpires: true,
  createdAt: true,
  updatedAt: true,
  // image: true,
  displayUsername: true,
});
