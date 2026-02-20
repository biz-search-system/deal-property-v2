import type {
  properties,
  propertyStaff,
  contractProgress,
  documentProgress,
  propertyDocumentItems,
  settlementProgress,
  propertyProgressHistory,
  progressStatus,
  documentStatus,
  documentItemStatus,
  documentItemType,
  documentItemTypeBank,
  documentItemTypeRentalManagement,
  documentItemTypeBuildingManagement,
  documentItemTypeGovernment,
  accountCompany,
  bankAccount,
  brokerCompany,
  companyB,
  contractType,
} from "../schemas/property";

// ==================== Enum型定義 ====================

/** 進捗ステータスの型 */
export type ProgressStatus = (typeof progressStatus)[number];
/** 書類ステータスの型 */
export type DocumentStatus = (typeof documentStatus)[number];
/** 使用口座会社の型 */
export type AccountCompany = (typeof accountCompany)[number];
/** 使用銀行口座の型 */
export type BankAccount = (typeof bankAccount)[number];
/** 仲介会社の型 */
export type BrokerCompany = (typeof brokerCompany)[number];
/** B会社の型 */
export type CompanyB = (typeof companyB)[number];
/** 契約形態の型 */
export type ContractType = (typeof contractType)[number];
/** 書類項目ステータスの型 */
export type DocumentItemStatus = (typeof documentItemStatus)[number];
/** 書類項目種別の型（全体） */
export type DocumentItemType = (typeof documentItemType)[number];
/** 書類項目種別の型（銀行関係） */
export type DocumentItemTypeBank = (typeof documentItemTypeBank)[number];
/** 書類項目種別の型（賃貸管理関係） */
export type DocumentItemTypeRentalManagement =
  (typeof documentItemTypeRentalManagement)[number];
/** 書類項目種別の型（建物管理関係） */
export type DocumentItemTypeBuildingManagement =
  (typeof documentItemTypeBuildingManagement)[number];
/** 書類項目種別の型（役所関係） */
export type DocumentItemTypeGovernment =
  (typeof documentItemTypeGovernment)[number];

// ==================== Enum定義 ====================

/** 管理組織タイプ */
export const managementOrgType = ["management", "sales", "office"] as const;
export type ManagementOrgType = (typeof managementOrgType)[number];

/** BC精算書ステータス */
export const bcSettlementStatus = [
  "not_created",
  "created",
  "sent",
  "cb_done",
] as const;
export type BcSettlementStatus = (typeof bcSettlementStatus)[number];

/** AB精算書ステータス */
export const abSettlementStatus = [
  "not_created",
  "created",
  "sent",
  "cr_done",
] as const;
export type AbSettlementStatus = (typeof abSettlementStatus)[number];

/** 本人確認書類ステータス */
export const identityVerification = [
  "none",
  "sent",
  "received",
  "returned",
] as const;
export type IdentityVerification = (typeof identityVerification)[number];

/** 権利証 */
export const propertyTitleStatus = ["unconfirmed", "available", "unavailable"] as const;
export type PropertyTitleStatus = (typeof propertyTitleStatus)[number];

/** 氏名変更 */
export const nameChangeStatus = ["unconfirmed", "available", "unavailable"] as const;
export type NameChangeStatus = (typeof nameChangeStatus)[number];

/** 住所変更 */
export const addressChangeStatus = ["unconfirmed", "none", "once", "twice_or_more"] as const;
export type AddressChangeStatus = (typeof addressChangeStatus)[number];

/** 抵当銀行ステータス */
export const mortgageBankStatus = ["none", "requested", "accepted"] as const;
export type MortgageBankStatus = (typeof mortgageBankStatus)[number];

/** 管理解約依頼ステータス */
export const managementCancel = ["none", "requested", "completed"] as const;
export type ManagementCancel = (typeof managementCancel)[number];

/** 保証会社承継ステータス */
export const guaranteeTransfer = ["none", "requested", "completed"] as const;
export type GuaranteeTransfer = (typeof guaranteeTransfer)[number];

/** 鍵ステータス */
export const keyStatus = ["none", "received", "sent"] as const;
export type KeyStatus = (typeof keyStatus)[number];

/** 管積口座振替手続きステータス */
export const accountTransfer = ["none", "received", "sent"] as const;
export type AccountTransfer = (typeof accountTransfer)[number];

// ==================== 新規追加項目（2026-01-17変更仕様） ====================

/** 抵当権抹消ステータス */
export const mortgageCancellation = [
  "not_requested",
  "confirming",
  "in_progress",
  "completed",
  "not_required",
] as const;
export type MortgageCancellation = (typeof mortgageCancellation)[number];

/** 本人確認方法 */
export const identityVerificationMethod = [
  "not_confirmed",
  "confirming",
  "limited_mail",
  "in_person",
] as const;
export type IdentityVerificationMethod =
  (typeof identityVerificationMethod)[number];

/** 本人確認電話ステータス */
export const identityVerificationCall = [
  "not_requested",
  "schedule_confirming",
  "in_progress",
  "completed",
  "not_required",
] as const;
export type IdentityVerificationCall =
  (typeof identityVerificationCall)[number];

/** 本人確認ステータス */
export const identityVerificationStatus = [
  "not_started",
  "document_sent",
  "document_received",
  "document_returned",
  "completed",
  "not_required",
] as const;
export type IdentityVerificationStatusType =
  (typeof identityVerificationStatus)[number];

/** 手出し状況ステータス */
export const sellerFundingStatus = [
  "not_required",
  "preliminary_review",
  "final_review",
  "review_completed",
  "funds_ready",
] as const;
export type SellerFundingStatus = (typeof sellerFundingStatus)[number];

/** サブリース承継ステータス */
export const subleaseSuccession = [
  "not_required",
  "confirming",
  "in_progress",
  "completed",
] as const;
export type SubleaseSuccession = (typeof subleaseSuccession)[number];

/** 賃契原本＆鍵ステータス */
export const rentalContractAndKey = [
  "not_requested",
  "confirming",
  "in_progress",
  "completed",
  "not_required",
] as const;
export type RentalContractAndKey = (typeof rentalContractAndKey)[number];

/** 保証会社承継ステータス */
export const guaranteeCompanySuccession = [
  "not_required",
  "confirming",
  "in_progress",
  "completed",
] as const;
export type GuaranteeCompanySuccession =
  (typeof guaranteeCompanySuccession)[number];

// ==================== テーブル型定義 ====================

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

export type PropertyStaff = typeof propertyStaff.$inferSelect;
export type InsertPropertyStaff = typeof propertyStaff.$inferInsert;

export type ContractProgress = typeof contractProgress.$inferSelect;
export type InsertContractProgress = typeof contractProgress.$inferInsert;

export type DocumentProgress = typeof documentProgress.$inferSelect;
export type InsertDocumentProgress = typeof documentProgress.$inferInsert;

export type SettlementProgress = typeof settlementProgress.$inferSelect;
export type InsertSettlementProgress = typeof settlementProgress.$inferInsert;

export type PropertyProgressHistory =
  typeof propertyProgressHistory.$inferSelect;
export type InsertPropertyProgressHistory =
  typeof propertyProgressHistory.$inferInsert;

export type PropertyDocumentItem = typeof propertyDocumentItems.$inferSelect;
export type InsertPropertyDocumentItem =
  typeof propertyDocumentItems.$inferInsert;
