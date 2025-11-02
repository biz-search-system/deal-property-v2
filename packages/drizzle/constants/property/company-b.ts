/** B会社 */
export const companyB = [
  "legit",
  "life",
  "ms",
  "second",
  // "shine",
  "trader",
  "esc",
] as const;
/** B会社の型 */
export type CompanyB = (typeof companyB)[number];
/**
 * B会社の表示名マッピング
 */
export const COMPANY_B_LABELS: Record<CompanyB, string> = {
  legit: "レイジット",
  life: "ライフ",
  ms: "エムズ",
  second: "セカンド",
  // shine: "シャイン",
  trader: "取引業者",
  esc: "エスク",
};

// B会社のカラーマッピング
export const COMPANY_B_COLORS: Record<CompanyB, string> = {
  legit:
    "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300", // レイジット
  life: "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300", // ライフインベスト
  ms: "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300", // エムズ
  second:
    "border-teal-400 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300", // セカンド
  // shine:
  //   "border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300", // シャイン
  trader:
    "border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300", // 取引業者
  esc: "border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300", // エスク
};
