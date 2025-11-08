import { BankAccount } from "../../../drizzle/types/property";

/**
 * 使用銀行口座の表示名マッピング
 */
export const BANK_ACCOUNT_LABELS: Record<BankAccount, string> = {
  // レイジット (legit)
  gmo_main: "GMOメイン",
  gmo_sub: "GMOサブ",
  kinsan: "近産",
  // ライフ (life)
  main_1727088: "メイン1727088",
  sub_1728218: "サブ1728218",
  new_main_2309414: "新メイン2309414",
  // エムズ (ms)
  sumi_shin: "住信",
  // gmo_main: "GMOメイン", // レイジットと重複
  // gmo_sub: "GMOサブ",   // レイジットと重複
  rakuten: "楽天",
  paypay_1: "PayPay①",
  paypay_2: "PayPay②",
  paypay_3: "PayPay③",
};
/**
 * 使用銀行口座のカラーマッピング
 */
export const BANK_ACCOUNT_COLORS: Record<BankAccount, string> = {
  // レイジット (legit)
  gmo_main:
    "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  gmo_sub:
    "border-sky-400 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  kinsan:
    "border-violet-400 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  // ライフ (life)
  main_1727088:
    "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  sub_1728218:
    "border-sky-400 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  new_main_2309414:
    "border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  // エムズ (ms)
  sumi_shin:
    "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  rakuten:
    "border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  paypay_1:
    "border-red-400 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  paypay_2:
    "border-slate-400 bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300",
  paypay_3:
    "border-cyan-400 bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
};
