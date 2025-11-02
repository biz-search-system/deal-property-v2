/** 進捗ステータスの配列 */
export const progressStatus = [
  "bc_before_confirmed",
  "waiting_contract_cb",
  "waiting_bc_contract",
  "waiting_settlement_date",
  "waiting_settlement_cb",
  "waiting_settlement",
  "settlement_completed",
] as const;

/** 進捗ステータスの型 */
export type ProgressStatus = (typeof progressStatus)[number];

/** 進捗ステータスの表示名マッピング */
export const PROGRESS_STATUS_LABELS: Record<ProgressStatus, string> = {
  bc_before_confirmed: "BC確定前",
  waiting_contract_cb: "契約CB待ち",
  waiting_bc_contract: "BC契約待ち",
  waiting_settlement_date: "決済日待ち",
  waiting_settlement_cb: "精算CB待ち",
  waiting_settlement: "決済待ち",
  settlement_completed: "決済完了",
} as const;

/** 進捗ステータスのカラーマッピング */
export const PROGRESS_STATUS_COLORS: Record<ProgressStatus, string> = {
  bc_before_confirmed:
    "border-slate-400 bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300", // BC確定前（初期段階・未開始）
  waiting_contract_cb:
    "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300", // 契約CB待ち（準備段階）
  waiting_bc_contract:
    "border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300", // BC契約待ち（契約進行中）
  waiting_settlement_date:
    "border-sky-400 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300", // 決済日待ち（中間段階）
  waiting_settlement_cb:
    "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300", // 精算CB待ち（精算段階）
  waiting_settlement:
    "border-indigo-400 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300", // 決済待ち（最終確認段階）
  settlement_completed:
    "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", // 決済完了（完了・成功）
};
