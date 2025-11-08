import { AccountCompany } from "../../../drizzle/types/property";

/**
 * 使用口座会社の表示名マッピング
 */
export const ACCOUNT_COMPANY_LABELS: Record<AccountCompany, string> = {
  legit: "レイジット",
  life: "ライフ",
  ms: "エムズ",
};
/**
 * 使用口座会社のカラーマッピング
 */
export const ACCOUNT_COMPANY_COLORS: Record<AccountCompany, string> = {
  legit:
    "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300", // レイジット
  life: "border-violet-700 bg-violet-150 text-violet-700 dark:bg-violet-950 dark:text-violet-300", // ライフ
  ms: "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300", // エムズ
};
