import { z } from "zod";

const passwordSchema = z
  .string()
  .trim()
  .min(8, "パスワードは8文字以上で設定してください")
  .max(100, "パスワードは100文字以内で入力してください");
const emailSchema = z.email({
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
  .regex(/^[a-zA-Z0-9_]+$/, "ユーザー名は英数字、ハイフンのみ使用できます");

// サインアップフォームのバリデーションスキーマ
export const signupSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  username: usernameSchema,
  password: passwordSchema,
  invitationId: z.string().min(1, "招待IDが必要です"),
});
/** ログインフォームのバリデーションスキーマ */
export const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .trim()
    .min(1, "メールアドレスまたはユーザーIDは1文字以上で入力してください")
    .max(255, "メールアドレスまたはユーザーIDは255文字以内で入力してください"),
  password: passwordSchema,
});
/** パスワード忘れフォームのバリデーションスキーマ */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
/** パスワードリセットフォームのバリデーションスキーマ */
export const resetPasswordSchema = z.object({
  password: passwordSchema,
});

export const passwordChangeSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});

export const slugSchema = z
  .string()
  .trim()
  .min(2, "スラッグは2文字以上で入力してください")
  .max(50, "スラッグは50文字以内で入力してください")
  .regex(
    /^[a-z0-9_]+$/,
    "スラッグは半角英数字、アンダースコアのみ使用できます"
  );

export const organizationCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "組織名は必須です")
    .max(100, "組織名は100文字以内で入力してください"),
  slug: slugSchema,
});
