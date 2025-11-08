import { users } from "../schemas/auth";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// 基本的なユーザーinsertスキーマ（テーブル構造ベース）
export const userInsertBaseSchema = createInsertSchema(users, {
  email: (email) =>
    email
      .trim()
      .min(1, "メールアドレスは必須です")
      .max(255, "メールアドレスは255文字以内で入力してください"),
  name: (name) =>
    name
      .trim()
      .min(1, "名前は必須です")
      .max(100, "名前は100文字以内で入力してください"),
  username: (username) =>
    username
      .trim()
      .min(3, "ユーザー名は3文字以上で入力してください")
      .max(20, "ユーザー名は20文字以内で入力してください")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "ユーザー名は英数字、ハイフン、アンダースコアのみ使用できます"
      ),
});

// サインアップ用スキーマ（テーブルにないフィールドを追加）
export const signupSchema = userInsertBaseSchema.extend({
  password: z.string().min(8, "パスワードは8文字以上で設定してください"),
  invitationId: z.string().min(1, "招待IDが必要です"),
});
