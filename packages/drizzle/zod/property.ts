import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import {
  properties,
  propertyStaff,
  contractProgress,
  documentProgress,
  settlementProgress,
} from "../schemas/property";

// ==================== 案件テーブル ====================

export const propertyInsertSchema = createInsertSchema(properties, {
  propertyName: z
    .string()
    .trim()
    .min(1, "物件名は必須です")
    .max(100, "物件名は100文字以内で入力してください"),
  roomNumber: z
    .string()
    .trim()
    .max(20, "号室は20文字以内で入力してください")
    .nullable()
    .optional(),
  ownerName: z
    .string()
    .trim()
    .min(1, "オーナー名は必須です")
    .max(100, "オーナー名は100文字以内で入力してください"),
  amountA: z
    .number()
    .nonnegative("A金額は0以上で入力してください")
    .nullable()
    .optional(),
  amountExit: z
    .number()
    .nonnegative("出口金額は0以上で入力してください")
    .nullable()
    .optional(),
  commission: z
    .number()
    .nonnegative("仲手等は0以上で入力してください")
    .nullable()
    .optional(),
  bcDeposit: z
    .number()
    .nonnegative("BC手付は0以上で入力してください")
    .nullable()
    .optional(),
  buyerCompany: z
    .string()
    .trim()
    .max(100, "買取業者は100文字以内で入力してください")
    .nullable()
    .optional(),
  mortgageBank: z
    .string()
    .trim()
    .max(100, "抵当銀行は100文字以内で入力してください")
    .nullable()
    .optional(),
  listType: z
    .string()
    .trim()
    .max(50, "名簿種別は50文字以内で入力してください")
    .nullable()
    .optional(),
  notes: z
    .string()
    .trim()
    .max(1000, "備考は1000文字以内で入力してください")
    .nullable()
    .optional(),
});

export const propertySelectSchema = createSelectSchema(properties);

// ==================== 案件担当者中間テーブル ====================

export const propertyStaffInsertSchema = createInsertSchema(propertyStaff);
export const propertyStaffSelectSchema = createSelectSchema(propertyStaff);

// ==================== 契約進捗テーブル ====================

export const contractProgressInsertSchema =
  createInsertSchema(contractProgress);
export const contractProgressSelectSchema =
  createSelectSchema(contractProgress);

// ==================== 書類進捗テーブル ====================

export const documentProgressInsertSchema =
  createInsertSchema(documentProgress);
export const documentProgressSelectSchema =
  createSelectSchema(documentProgress);

// ==================== 決済進捗テーブル ====================

export const settlementProgressInsertSchema =
  createInsertSchema(settlementProgress);
export const settlementProgressSelectSchema =
  createSelectSchema(settlementProgress);

// ==================== 複合スキーマ ====================

/**
 * 案件作成用の複合スキーマ
 * 案件本体 + 担当者配列を含む
 */
export const propertyCreateSchema = z.object({
  // 案件基本情報
  propertyName: z
    .string()
    .trim()
    .min(1, "物件名は必須です")
    .max(100, "物件名は100文字以内で入力してください"),
  roomNumber: z
    .string()
    .trim()
    .max(20, "号室は20文字以内で入力してください")
    .optional(),
  ownerName: z
    .string()
    .trim()
    .min(1, "オーナー名は必須です")
    .max(100, "オーナー名は100文字以内で入力してください"),

  // 金額情報
  amountA: z.number().nonnegative("A金額は0以上で入力してください").optional(),
  amountExit: z
    .number()
    .nonnegative("出口金額は0以上で入力してください")
    .optional(),
  commission: z
    .number()
    .nonnegative("仲手等は0以上で入力してください")
    .optional(),
  bcDeposit: z
    .number()
    .nonnegative("BC手付は0以上で入力してください")
    .optional(),

  // 日付情報
  contractDateA: z.string().optional(),
  contractDateBc: z.string().optional(),
  settlementDate: z.string().optional(),

  // 契約情報
  contractType: z.string().optional(),
  companyB: z.string().optional(),
  brokerCompany: z.string().optional(),
  buyerCompany: z
    .string()
    .trim()
    .max(100, "買取業者は100文字以内で入力してください")
    .optional(),
  mortgageBank: z
    .string()
    .trim()
    .max(100, "抵当銀行は100文字以内で入力してください")
    .optional(),

  // その他
  listType: z
    .string()
    .trim()
    .max(50, "名簿種別は50文字以内で入力してください")
    .optional(),
  notes: z
    .string()
    .trim()
    .max(1000, "備考は1000文字以内で入力してください")
    .optional(),

  // 進捗ステータス
  progressStatus: z.string().optional(),
  documentStatus: z.string().optional(),

  // 口座情報
  accountCompany: z.string().optional(),
  bankAccount: z.string().optional(),

  // 組織ID（必須）
  organizationId: z.string().min(1, "組織は必須です"),

  // 担当者（必須、最低1名）
  staffIds: z.array(z.string()).min(1, "担当者は最低1名選択してください"),
});

/**
 * 案件更新用の複合スキーマ
 * 案件IDを含む
 */
export const propertyUpdateSchema = propertyCreateSchema.extend({
  id: z.string().min(1, "案件IDは必須です"),
});

export type PropertyCreate = z.infer<typeof propertyCreateSchema>;
export type PropertyUpdate = z.infer<typeof propertyUpdateSchema>;
