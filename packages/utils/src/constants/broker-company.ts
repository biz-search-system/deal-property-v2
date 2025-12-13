import { BrokerCompany } from "../../../drizzle/types/property";

/*
 * 仲介会社の表示名マッピング
 */
export const BROKER_COMPANY_LABELS: Record<BrokerCompany, string> = {
  legit: "レイジット",
  tousei: "TOUSEI",
  ms: "エムズ",
  rd: "RD",
  nbf: "NBF",
  shine: "シャイン",
  esc: "エスク",
  none: "無し",
};

/**
 * 仲介会社のカラーマッピング
 */
export const BROKER_COMPANY_COLORS: Record<BrokerCompany, string> = {
  legit:
    "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300", // レイジット
  tousei:
    "border-violet-700 bg-violet-150 text-violet-700 dark:bg-violet-950 dark:text-violet-300", // TOUSEI
  ms: "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300", // エムズ
  rd: "border-green-400 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300", // RD
  nbf: "border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300", // NBF
  shine:
    "border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300", // シャイン
  esc: "border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300", // エスク
  none: "border-gray-300 bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500", // 無し
};
