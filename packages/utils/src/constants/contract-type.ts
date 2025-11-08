import { ContractType } from "../../../drizzle/types/property";

// 契約形態の表示名マッピング
export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  ab_bc: "AB・BC",
  ac: "AC",
  iyaku: "違約",
  hakushi: "白紙",
  mitei: "未定",
  jisha: "自社仕入れ",
  bengoshi: "弁護士",
  kaichu: "買仲",
  iyaku_yotei: "違約予定",
};

// 契約形態のカラーマッピング
export const CONTRACT_TYPE_COLORS: Record<ContractType, string> = {
  ab_bc:
    "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300", // AB・BC
  ac: "border-zinc-700 bg-zinc-50 text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300", // AC
  iyaku:
    "border-red-400 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300", // 違約
  hakushi:
    "border-slate-400 bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300", // 白紙
  mitei:
    "border-indigo-400 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300", // 未定
  jisha:
    "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300", // 自社仕入れ
  bengoshi:
    "border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300", // 弁護士
  kaichu:
    "border-green-400 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300", // 買仲
  iyaku_yotei:
    "border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300", // 違約予定
};
