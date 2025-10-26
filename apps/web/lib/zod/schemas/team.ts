import { z } from "zod";

// チーム作成のバリデーションスキーマ
export const createTeamSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "チーム名は必須です")
    .max(50, "チーム名は50文字以内で入力してください"),
  organizationId: z.string(),
});

// チーム更新のバリデーションスキーマ
export const updateTeamSchema = z.object({
  teamId: z.string(),
  name: z
    .string()
    .trim()
    .min(1, "チーム名は必須です")
    .max(50, "チーム名は50文字以内で入力してください"),
});

// チームメンバー追加のバリデーションスキーマ
export const addTeamMemberSchema = z.object({
  teamId: z.string(),
  userId: z.string(),
});

// チームメンバー削除のバリデーションスキーマ
export const removeTeamMemberSchema = z.object({
  teamId: z.string(),
  userId: z.string(),
});