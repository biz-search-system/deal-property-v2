import { AccountCompany, BankAccount } from "../../../drizzle/types/property";

/**
 * 口座会社ごとの銀行口座マッピング
 * 各会社が保有する銀行口座のリストを定義
 */
export const BANK_ACCOUNT_BY_COMPANY: Record<AccountCompany, BankAccount[]> = {
  legit: ["gmo_main", "gmo_sub", "kinsan"],
  life: ["main_1727088", "sub_1728218", "new_main_2309414"],
  ms: [
    "sumi_shin",
    "gmo_main",
    "gmo_sub",
    "rakuten",
    "paypay_1",
    "paypay_2",
    "paypay_3",
  ],
};

/**
 * 指定された口座会社の銀行口座リストを取得
 * @param company 口座会社
 * @returns 銀行口座のリスト
 */
export function getBankAccountsByCompany(
  company: AccountCompany | null | undefined,
): BankAccount[] {
  if (!company) return [];
  return BANK_ACCOUNT_BY_COMPANY[company] || [];
}
