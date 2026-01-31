import type {
  MortgageCancellation,
  IdentityVerificationMethod,
  IdentityVerificationCall,
  IdentityVerificationStatusType,
  SellerFundingStatus,
  SubleaseSuccession,
  RentalContractAndKey,
  GuaranteeCompanySuccession,
} from "../../../drizzle/types/property";

// ==================== 共通カラー定義 ====================
// 進捗ステータスの段階を表すBadgeスタイル

const STATUS_BADGE_STYLES = {
  /** 初期状態・未開始（slate） */
  initial:
    "border-slate-400 bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300",
  /** 準備段階・確認中（amber） */
  preparing:
    "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  /** 進行中・対応中（sky） */
  inProgress:
    "border-sky-400 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  /** 中間段階・処理中（blue） */
  processing:
    "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  /** 最終確認段階・方法確定（indigo） */
  finalizing:
    "border-indigo-400 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  /** 完了・成功（emerald） */
  completed:
    "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  /** 不要・対象外（purple） */
  notRequired:
    "border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
};

// ==================== 抵当権抹消 ====================

export const MORTGAGE_CANCELLATION_LABELS: Record<
  MortgageCancellation,
  string
> = {
  not_requested: "未依頼",
  confirming: "確認中",
  in_progress: "対応中",
  completed: "完了",
  not_required: "不要",
};

export const MORTGAGE_CANCELLATION_COLORS: Record<
  MortgageCancellation,
  string
> = {
  not_requested: STATUS_BADGE_STYLES.initial,
  confirming: STATUS_BADGE_STYLES.preparing,
  in_progress: STATUS_BADGE_STYLES.inProgress,
  completed: STATUS_BADGE_STYLES.completed,
  not_required: STATUS_BADGE_STYLES.notRequired,
};

// ==================== 本人確認方法 ====================

export const IDENTITY_VERIFICATION_METHOD_LABELS: Record<
  IdentityVerificationMethod,
  string
> = {
  not_confirmed: "未確認",
  confirming: "確認中",
  limited_mail: "限定郵便",
  in_person: "立会",
};

export const IDENTITY_VERIFICATION_METHOD_COLORS: Record<
  IdentityVerificationMethod,
  string
> = {
  not_confirmed: STATUS_BADGE_STYLES.initial,
  confirming: STATUS_BADGE_STYLES.preparing,
  limited_mail: STATUS_BADGE_STYLES.processing,
  in_person: STATUS_BADGE_STYLES.finalizing,
};

// ==================== 本人確認電話 ====================

export const IDENTITY_VERIFICATION_CALL_LABELS: Record<
  IdentityVerificationCall,
  string
> = {
  not_requested: "未依頼",
  schedule_confirming: "日時確認中",
  in_progress: "対応中",
  completed: "完了",
  not_required: "不要",
};

export const IDENTITY_VERIFICATION_CALL_COLORS: Record<
  IdentityVerificationCall,
  string
> = {
  not_requested: STATUS_BADGE_STYLES.initial,
  schedule_confirming: STATUS_BADGE_STYLES.preparing,
  in_progress: STATUS_BADGE_STYLES.inProgress,
  completed: STATUS_BADGE_STYLES.completed,
  not_required: STATUS_BADGE_STYLES.notRequired,
};

// ==================== 本人確認ステータス ====================

export const IDENTITY_VERIFICATION_STATUS_LABELS: Record<
  IdentityVerificationStatusType,
  string
> = {
  not_started: "未対応",
  document_sent: "書類発送",
  document_received: "書類受取",
  document_returned: "書類返送",
  completed: "完了",
  not_required: "不要",
};

export const IDENTITY_VERIFICATION_STATUS_COLORS: Record<
  IdentityVerificationStatusType,
  string
> = {
  not_started: STATUS_BADGE_STYLES.initial,
  document_sent: STATUS_BADGE_STYLES.preparing,
  document_received: STATUS_BADGE_STYLES.inProgress,
  document_returned: STATUS_BADGE_STYLES.processing,
  completed: STATUS_BADGE_STYLES.completed,
  not_required: STATUS_BADGE_STYLES.notRequired,
};

// ==================== 手出し状況 ====================

export const SELLER_FUNDING_STATUS_LABELS: Record<SellerFundingStatus, string> =
  {
    not_required: "不要",
    preliminary_review: "仮審査中",
    final_review: "本審査中",
    review_completed: "審査完了",
    funds_ready: "用意完了",
  };

export const SELLER_FUNDING_STATUS_COLORS: Record<SellerFundingStatus, string> =
  {
    not_required: STATUS_BADGE_STYLES.notRequired,
    preliminary_review: STATUS_BADGE_STYLES.preparing,
    final_review: STATUS_BADGE_STYLES.inProgress,
    review_completed: STATUS_BADGE_STYLES.processing,
    funds_ready: STATUS_BADGE_STYLES.completed,
  };

// ==================== サブリース承継 ====================

export const SUBLEASE_SUCCESSION_LABELS: Record<SubleaseSuccession, string> = {
  not_required: "不要",
  confirming: "確認中",
  in_progress: "対応中",
  completed: "完了",
};

export const SUBLEASE_SUCCESSION_COLORS: Record<SubleaseSuccession, string> = {
  not_required: STATUS_BADGE_STYLES.notRequired,
  confirming: STATUS_BADGE_STYLES.preparing,
  in_progress: STATUS_BADGE_STYLES.inProgress,
  completed: STATUS_BADGE_STYLES.completed,
};

// ==================== 賃契原本＆鍵 ====================

export const RENTAL_CONTRACT_AND_KEY_LABELS: Record<
  RentalContractAndKey,
  string
> = {
  not_requested: "未依頼",
  confirming: "確認中",
  in_progress: "対応中",
  completed: "完了",
  not_required: "不要",
};

export const RENTAL_CONTRACT_AND_KEY_COLORS: Record<
  RentalContractAndKey,
  string
> = {
  not_requested: STATUS_BADGE_STYLES.initial,
  confirming: STATUS_BADGE_STYLES.preparing,
  in_progress: STATUS_BADGE_STYLES.inProgress,
  completed: STATUS_BADGE_STYLES.completed,
  not_required: STATUS_BADGE_STYLES.notRequired,
};

// ==================== 保証会社承継 ====================

export const GUARANTEE_COMPANY_SUCCESSION_LABELS: Record<
  GuaranteeCompanySuccession,
  string
> = {
  not_required: "不要",
  confirming: "確認中",
  in_progress: "対応中",
  completed: "完了",
};

export const GUARANTEE_COMPANY_SUCCESSION_COLORS: Record<
  GuaranteeCompanySuccession,
  string
> = {
  not_required: STATUS_BADGE_STYLES.notRequired,
  confirming: STATUS_BADGE_STYLES.preparing,
  in_progress: STATUS_BADGE_STYLES.inProgress,
  completed: STATUS_BADGE_STYLES.completed,
};

// ==================== Nullable Boolean (有/無/未設定) ====================

export const NULLABLE_BOOLEAN_LABELS = {
  true: "有",
  false: "無",
  null: "未設定",
};

export const NULLABLE_BOOLEAN_COLORS = {
  true: STATUS_BADGE_STYLES.completed,
  false: STATUS_BADGE_STYLES.initial,
  null: STATUS_BADGE_STYLES.preparing,
};
