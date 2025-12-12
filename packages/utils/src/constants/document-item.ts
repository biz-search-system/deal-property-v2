import type {
  DocumentItemType,
  DocumentItemStatus,
} from "../../../drizzle/types/property";

/**
 * 書類項目ステータスの表示名マッピング
 */
export const DOCUMENT_ITEM_STATUS_LABELS: Record<DocumentItemStatus, string> = {
  not_requested: "未依頼",
  requesting: "依頼中",
  acquired: "取得済",
  not_required: "不要",
} as const;

/**
 * 書類項目ステータスのカラーマッピング
 */
export const DOCUMENT_ITEM_STATUS_COLORS: Record<DocumentItemStatus, string> = {
  not_requested:
    "border-slate-300 bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400",
  requesting:
    "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  acquired:
    "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  not_required:
    "border-gray-300 bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500",
} as const;

/**
 * 書類項目種別の表示名マッピング
 */
export const DOCUMENT_ITEM_TYPE_LABELS: Record<DocumentItemType, string> = {
  // 銀行関係
  loan_calculation: "ローン計算書",
  // 賃貸管理関係
  rental_contract: "賃貸借契約書",
  management_contract: "管理委託契約書",
  move_in_application: "入居申込書",
  // 建物管理関係
  important_matters_report: "重要事項調査報告書",
  management_rules: "管理規約",
  long_term_repair_plan: "長期修繕計画書",
  general_meeting_minutes: "総会議事録",
  pamphlet: "パンフレット",
  bank_transfer_form: "口座振替用紙",
  owner_change_notification: "所有者変更届",
  // 役所関係
  tax_certificate: "公課証明",
  building_plan_overview: "建築計画概要書",
  ledger_certificate: "台帳記載事項証明書",
  zoning_district: "用途地域",
  road_ledger: "道路台帳",
} as const;

/**
 * 銀行関係の書類項目
 */
export const DOCUMENT_ITEMS_BANK: DocumentItemType[] = ["loan_calculation"];

/**
 * 賃貸管理関係の書類項目
 */
export const DOCUMENT_ITEMS_RENTAL_MANAGEMENT: DocumentItemType[] = [
  "rental_contract",
  "management_contract",
  "move_in_application",
];

/**
 * 建物管理関係の書類項目
 */
export const DOCUMENT_ITEMS_BUILDING_MANAGEMENT: DocumentItemType[] = [
  "important_matters_report",
  "management_rules",
  "long_term_repair_plan",
  "general_meeting_minutes",
  "pamphlet",
  "bank_transfer_form",
  "owner_change_notification",
];

/**
 * 役所関係の書類項目
 */
export const DOCUMENT_ITEMS_GOVERNMENT: DocumentItemType[] = [
  "tax_certificate",
  "building_plan_overview",
  "ledger_certificate",
  "zoning_district",
  "road_ledger",
];
