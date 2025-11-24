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

/**
 * 組織の順序マッピング（並び替え用）
 * レイジット、エスク、シャインテラスの順
 */
const ORGANIZATION_ORDER: Record<OrganizationNameType, number> = {
  レイジット: 0,
  エスク: 1,
  シャインテラス: 2,
};

/**
 * 組織リストを指定された順序で並び替える
 * @param organizations 並び替える組織の配列
 * @returns 並び替えられた組織の配列
 */
export function sortOrganizations<T extends { name: string }>(
  organizations: T[]
): T[] {
  return [...organizations].sort((a, b) => {
    const orderA = ORGANIZATION_ORDER[a.name as OrganizationNameType] ?? 999;
    const orderB = ORGANIZATION_ORDER[b.name as OrganizationNameType] ?? 999;
    return orderA - orderB;
  });
}
