import { z } from "zod";
import { accountCompany, bankAccount } from "@workspace/drizzle/schemas";

/**
 * 口座情報の基本スキーマ
 * 口座会社と銀行口座の組み合わせを検証
 */
export const bankAccountSchema = z.object({
  accountCompany: z.enum(accountCompany, { message: "無効な口座会社です" }),
  bankAccount: z.enum(bankAccount, { message: "無効な銀行口座です" }),
});

/**
 * 物件の口座情報更新用スキーマ
 */
export const propertyBankAccountSchema = bankAccountSchema.extend({
  propertyId: z.string().trim().min(1, "物件IDは必須です"),
});
