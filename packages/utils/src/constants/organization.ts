/** 組織の値 */
export const organization = ["レイジット", "エスク", "シャインテラス"] as const;
/**
 * 組織の型
 */
export type OrganizationNameType = (typeof organization)[number];

/**
 * 組織の表示名マッピング
 */
export const ORGANIZATION_LABELS: Record<OrganizationNameType, string> = {
  レイジット: "レイジット",
  シャインテラス: "シャインテラス",
  エスク: "エスク",
};
/**
 * 組織のカラーマッピング
 */
export const ORGANIZATION_COLORS: Record<OrganizationNameType, string> = {
  レイジット:
    "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300", // レイジット
  シャインテラス:
    "border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300", // シャイン
  エスク:
    "border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300", // エスク
};
