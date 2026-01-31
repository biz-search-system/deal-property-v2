import { z } from "zod";

/** 業者種別 */
export const brokerTypeSchema = z.enum(["buyer", "broker"]);

/** 業者作成スキーマ */
export const brokerCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "業者名は必須です")
    .max(200, "業者名は200文字以内で入力してください"),
  brokerType: brokerTypeSchema,
  contactName: z
    .string()
    .trim()
    .max(100, "担当者名は100文字以内で入力してください")
    .optional()
    .nullable(),
  email: z
    .string()
    .trim()
    .email("有効なメールアドレスを入力してください")
    .max(200, "メールアドレスは200文字以内で入力してください"),
  phone: z
    .string()
    .trim()
    .max(50, "電話番号は50文字以内で入力してください")
    .optional()
    .nullable(),
  address: z
    .string()
    .trim()
    .max(500, "住所は500文字以内で入力してください")
    .optional()
    .nullable(),
  startedAt: z.string().optional().nullable(),
  groupId: z.string().optional().nullable(),
  notes: z
    .string()
    .trim()
    .max(2000, "備考は2000文字以内で入力してください")
    .optional()
    .nullable(),
  isActive: z.boolean(),
  displayOrder: z.number().optional().nullable(),
});

export type BrokerCreate = z.infer<typeof brokerCreateSchema>;
