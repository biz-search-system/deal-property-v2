import type { MaisokuDistributionStatus } from "../../../drizzle/types/property";

/** マイソク配布ステータスの表示名マッピング */
export const MAISOKU_DISTRIBUTION_LABELS: Record<
  MaisokuDistributionStatus,
  string
> = {
  not_distributed: "未配布",
  distributed: "配布済",
};

/** マイソク配布ステータスのカラーマッピング */
export const MAISOKU_DISTRIBUTION_COLORS: Record<
  MaisokuDistributionStatus,
  string
> = {
  not_distributed:
    "border-slate-400 bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300",
  distributed:
    "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};
