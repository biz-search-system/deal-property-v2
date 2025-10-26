import { z } from "zod";

const passwordSchema = z
  .string()
  .trim()
  .min(8, "パスワードは8文字以上で設定してください")
  .max(100, "パスワードは100文字以内で入力してください");
export const emailSchema = z.email({
  message: "メールアドレスの形式で入力してください。",
});
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

// サインアップフォームのバリデーションスキーマ
export const signupSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  username: usernameSchema,
  password: passwordSchema,
  invitationId: z.string().min(1, "招待IDが必要です"),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
});
