import { z } from "zod";

/** 出口ステータス */
export const exitStatusSchema = z.enum([
  "not_purchased",
  "waiting_purchase",
  "negotiating",
  "confirmed",
  "breach",
  "troubled",
]);

/** 現況 */
export const situationSchema = z.enum(["renting", "sublease", "vacant"]);

/** 出口管理作成スキーマ */
export const exitCreateSchema = z.object({
  // 物件情報
  propertyName: z
    .string()
    .trim()
    .min(1, "物件名は必須です")
    .max(200, "物件名は200文字以内で入力してください"),
  roomNumber: z
    .string()
    .trim()
    .max(50, "号室は50文字以内で入力してください")
    .optional()
    .nullable(),
  address: z
    .string()
    .trim()
    .max(500, "住所は500文字以内で入力してください")
    .optional()
    .nullable(),
  builtDate: z.string().optional().nullable(),
  area: z.number().min(0, "面積は0以上で入力してください").optional().nullable(),
  structure: z
    .string()
    .trim()
    .max(50, "構造は50文字以内で入力してください")
    .optional()
    .nullable(),
  floor: z
    .string()
    .trim()
    .max(20, "階数は20文字以内で入力してください")
    .optional()
    .nullable(),

  // 現況情報
  situation: situationSchema.optional().nullable(),
  rent: z.number().min(0, "家賃は0以上で入力してください").optional().nullable(),
  managementFee: z
    .number()
    .min(0, "管理費は0以上で入力してください")
    .optional()
    .nullable(),

  // 金額情報（万円単位）
  purchasePrice: z
    .number()
    .min(0, "仕入れ金額は0以上で入力してください")
    .optional()
    .nullable(),
  maisokuPrice: z
    .number()
    .min(0, "マイソク価格は0以上で入力してください")
    .optional()
    .nullable(),
  brokerageFee: z
    .number()
    .min(0, "仲手は0以上で入力してください")
    .optional()
    .nullable(),
  expectedYield: z
    .number()
    .min(0, "想定利回りは0以上で入力してください")
    .max(100, "想定利回りは100以下で入力してください")
    .optional()
    .nullable(),

  // 担当・備考
  staffId: z.string().optional().nullable(),
  notes: z
    .string()
    .trim()
    .max(2000, "備考は2000文字以内で入力してください")
    .optional()
    .nullable(),

  // ステータス
  status: exitStatusSchema,
});

/** 出口管理作成型 */
export type ExitCreate = z.infer<typeof exitCreateSchema>;
