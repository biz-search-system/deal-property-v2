// ==================== Enum定義 ====================

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
export type ContractType = (typeof contractType)[number];

/** B会社 */
export const companyB = [
  "ms",
  "life",
  "legit",
  "esc",
  "trader",
  "shine",
  "second",
] as const;
export type CompanyB = (typeof companyB)[number];

/** 仲介会社 */
export const brokerCompany = [
  "legit",
  "tousei",
  "esc",
  "shine",
  "nbf",
  "rd",
  "ms",
] as const;
export type BrokerCompany = (typeof brokerCompany)[number];

/** 進捗ステータス */
export const progressStatus = [
  "bc_before_confirmed",
  "waiting_contract_cb",
  "waiting_bc_contract",
  "waiting_settlement_date",
  "waiting_settlement_cb",
  "waiting_settlement",
  "settlement_completed",
] as const;
export type ProgressStatus = (typeof progressStatus)[number];

/** 書類ステータス */
export const documentStatus = [
  "waiting_request",
  "in_progress",
  "completed",
] as const;
export type DocumentStatus = (typeof documentStatus)[number];

/** 使用口座会社 */
export const accountCompany = ["legit", "life", "ms"] as const;
export type AccountCompany = (typeof accountCompany)[number];

/** 使用銀行口座 */
export const bankAccount = [
  "gmo_main",
  "gmo_sub",
  "rakuten",
  "gmo",
  "mizuho",
] as const;
export type BankAccount = (typeof bankAccount)[number];

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

// ==================== テーブル型定義 ====================

import type {
  properties,
  propertyStaff,
  contractProgress,
  documentProgress,
  settlementProgress,
  propertyProgressHistory,
} from "../schemas/property";

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
