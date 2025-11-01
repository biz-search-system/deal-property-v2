/** 契約形態 */
export const contractType = [
  "ab_bc",
  "ac",
  "iyaku",
  "shirahaku",
  "mitei",
  "jisha",
  "bengoshi",
  "kaichu",
  "iyaku_yotei",
] as const;

/** 契約形態の型 */
export type ContractType = (typeof contractType)[number];

// 契約形態の表示名マッピング
export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  ab_bc: "AB・BC",
  ac: "AC",
  iyaku: "違約",
  shirahaku: "白紙",
  mitei: "未定",
  jisha: "自社仕入れ",
  bengoshi: "弁護士",
  kaichu: "買仲",
  iyaku_yotei: "違約予定",
};

// 契約形態のカラーマッピング
export const CONTRACT_TYPE_COLORS: Record<ContractType, string> = {
  ab_bc: "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  ac: "border-green-400 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  iyaku: "border-red-400 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  shirahaku: "border-gray-400 bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300",
  mitei: "border-slate-400 bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300",
  jisha: "border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  bengoshi: "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  kaichu: "border-cyan-400 bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  iyaku_yotei: "border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
};
