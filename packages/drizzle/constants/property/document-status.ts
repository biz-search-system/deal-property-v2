/** 書類ステータス */
export const documentStatus = [
  "waiting_request",
  "in_progress",
  "completed",
] as const;
/**
 * 書類ステータスの型
 */
export type DocumentStatus = (typeof documentStatus)[number];
/**
 * 書類ステータスの表示名マッピング
 */
export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  waiting_request: "書類依頼待ち",
  in_progress: "書類取得中",
  completed: "全書類取得完了",
} as const;

/** 書類ステータスのカラーマッピング */
export const DOCUMENT_STATUS_COLORS: Record<DocumentStatus, string> = {
  waiting_request:
    "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300", // 書類依頼待ち（準備段階）
  in_progress:
    "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300", // 書類取得中（進行中）
  completed:
    "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", // 全書類取得完了（完了・成功）
};
