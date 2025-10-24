import { z } from "zod";

// サインアップフォームのバリデーションスキーマ
export const signupSchema = z.object({
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください" }),
  name: z.string().min(1, "名前を入力してください"),
  username: z
    .string()
    .min(3, "ユーザー名は3文字以上で入力してください")
    .max(20, "ユーザー名は20文字以内で入力してください")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "ユーザー名は英数字、ハイフン、アンダースコアのみ使用できます"
    ),
  password: z.string().min(8, "パスワードは8文字以上で設定してください"),
  invitationId: z.string().min(1, "招待IDが必要です"),
});
