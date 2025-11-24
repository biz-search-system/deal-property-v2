import { z } from "zod";
import {
  bankAccountSchema,
  propertyBankAccountSchema,
} from "../zod/schemas/bank-account";

/**
 * 口座情報の基本型
 */
export type BankAccountInput = z.infer<typeof bankAccountSchema>;

/**
 * 物件の口座情報更新の入力型
 */
export type PropertyBankAccountInput = z.infer<
  typeof propertyBankAccountSchema
>;
