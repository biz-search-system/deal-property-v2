import { AccountCompany, BankAccount } from "../../../drizzle/types/property";

/**
 * 口座の上限設定（単位: 万円）
 * 各銀行口座の1日あたりの決済上限金額
 */
export const BANK_ACCOUNT_LIMITS: Record<
  AccountCompany,
  Partial<Record<BankAccount, number>>
> = {
  legit: {
    gmo_main: 50000, // 5億円
    gmo_sub: 10000, // 1億円
    kinsan: 10000, // 1億円
  },
  life: {
    main_1727088: 10000, // 1億円
    sub_1728218: 10000, // 1億円
    new_main_2309414: 10000, // 1億円
  },
  ms: {
    sumi_shin: 10000, // 1億円
    gmo_main: 100000, // 10億円
    gmo_sub: 10000, // 1億円
    rakuten: 10000, // 1億円
    paypay_1: 10000, // 1億円
    paypay_2: 10000, // 1億円
    paypay_3: 10000, // 1億円
  },
};

/**
 * デフォルトの口座上限金額（単位: 万円）
 */
export const DEFAULT_BANK_ACCOUNT_LIMIT = 10000; // 1億円

/**
 * 警告閾値（上限の何%で警告を出すか）
 */
export const WARNING_THRESHOLD_PERCENTAGE = 80; // 80%

/**
 * 指定された口座の上限金額を取得
 * @param company 口座会社
 * @param account 銀行口座
 * @returns 上限金額（単位: 万円）
 */
export function getBankAccountLimit(
  company: AccountCompany | null | undefined,
  account: BankAccount | null | undefined
): number {
  if (!company || !account) return DEFAULT_BANK_ACCOUNT_LIMIT;
  return BANK_ACCOUNT_LIMITS[company]?.[account] || DEFAULT_BANK_ACCOUNT_LIMIT;
}

/**
 * 金額が警告閾値を超えているかチェック
 * @param amount 金額（単位: 万円）
 * @param limit 上限金額（単位: 万円）
 * @returns 警告閾値を超えている場合true
 */
export function isNearLimit(amount: number, limit: number): boolean {
  return amount > (limit * WARNING_THRESHOLD_PERCENTAGE) / 100;
}

/**
 * 金額が上限を超えているかチェック
 * @param amount 金額（単位: 万円）
 * @param limit 上限金額（単位: 万円）
 * @returns 上限を超えている場合true
 */
export function isOverLimit(amount: number, limit: number): boolean {
  return amount > limit;
}

/**
 * 金額を億円単位でフォーマット
 * @param amount 金額（単位: 万円）
 * @returns フォーマット済みの文字列
 */
export function formatAmountInYen(amount: number): string {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(1)}億円`;
  }
  return `${amount.toLocaleString()}万円`;
}
