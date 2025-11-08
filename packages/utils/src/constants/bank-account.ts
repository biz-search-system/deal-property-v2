import { BankAccount } from "../../../drizzle/types/property";

/**
 * 使用銀行口座の表示名マッピング
 */
export const BANK_ACCOUNT_LABELS: Record<BankAccount, string> = {
  gmo_main: "GMOメイン",
  gmo_sub: "GMOサブ",
  rakuten: "楽天",
  gmo: "GMO",
  mizuho: "三井住友",
};
/**
 * 使用銀行口座のカラーマッピング
 */
export const BANK_ACCOUNT_COLORS: Record<BankAccount, string> = {
  gmo_main:
    "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  gmo_sub:
    "border-violet-700 bg-violet-150 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  rakuten:
    "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  gmo: "border-green-400 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  mizuho:
    "border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
};
