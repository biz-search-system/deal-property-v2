import type {
  BcSettlementStatus,
  AbSettlementStatus,
  PropertyTitleStatus,
} from "../../../drizzle/types/property";

/**
 * BC精算書ステータスの表示名マッピング
 */
export const BC_SETTLEMENT_STATUS_LABELS: Record<BcSettlementStatus, string> = {
  not_created: "未作成",
  created: "作成",
  sent: "送付",
  cb_done: "CB完了",
};

/**
 * BC精算書ステータスのカラーマッピング
 */
export const BC_SETTLEMENT_STATUS_COLORS: Record<BcSettlementStatus, string> = {
  not_created:
    "border-slate-400 bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300",
  created:
    "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  sent: "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  cb_done:
    "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

/**
 * AB精算書ステータスの表示名マッピング
 */
export const AB_SETTLEMENT_STATUS_LABELS: Record<AbSettlementStatus, string> = {
  not_created: "未作成",
  created: "作成",
  sent: "送付",
  cr_done: "CR完了",
};

/**
 * AB精算書ステータスのカラーマッピング
 */
export const AB_SETTLEMENT_STATUS_COLORS: Record<AbSettlementStatus, string> = {
  not_created:
    "border-slate-400 bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300",
  created:
    "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  sent: "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  cr_done:
    "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

/**
 * 権利証ステータスの表示名マッピング
 */
export const PROPERTY_TITLE_STATUS_LABELS: Record<
  PropertyTitleStatus,
  string
> = {
  unconfirmed: "未確認",
  available: "有",
  unavailable: "無",
};

/**
 * 権利証ステータスのカラーマッピング
 */
export const PROPERTY_TITLE_STATUS_COLORS: Record<
  PropertyTitleStatus,
  string
> = {
  unconfirmed:
    "border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  available:
    "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  unavailable:
    "border-slate-400 bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300",
};
