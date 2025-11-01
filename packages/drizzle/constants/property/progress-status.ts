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

/** 進捗ステータスのバッジスタイルマッピング */
export const PROGRESS_STATUS_STYLES: Record<
  ProgressStatus,
  {
    variant: "default" | "secondary" | "outline" | "destructive";
    className: string;
  }
> = {
  bc_before_confirmed: {
    variant: "outline",
    className: "border-gray-400 text-gray-700 dark:border-gray-600 dark:text-gray-300",
  },
  waiting_contract_cb: {
    variant: "outline",
    className: "border-yellow-500 text-yellow-700 dark:border-yellow-400 dark:text-yellow-300",
  },
  waiting_bc_contract: {
    variant: "outline",
    className: "border-orange-500 text-orange-700 dark:border-orange-400 dark:text-orange-300",
  },
  waiting_settlement_date: {
    variant: "outline",
    className: "border-blue-500 text-blue-700 dark:border-blue-400 dark:text-blue-300",
  },
  waiting_settlement_cb: {
    variant: "outline",
    className: "border-purple-500 text-purple-700 dark:border-purple-400 dark:text-purple-300",
  },
  waiting_settlement: {
    variant: "outline",
    className: "border-indigo-500 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300",
  },
  settlement_completed: {
    variant: "outline",
    className: "border-green-500 text-green-700 dark:border-green-400 dark:text-green-300",
  },
} as const;
