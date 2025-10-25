import { relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  unique,
  index,
} from "drizzle-orm/sqlite-core";
import {
  timestamps,
  customTimestamp,
  customTimestampNullable,
  id,
} from "../util";
import { users } from "./auth";
import {
  contractType,
  companyB,
  brokerCompany,
  progressStatus,
  documentStatus,
  accountCompany,
  bankAccount,
  bcSettlementStatus,
  abSettlementStatus,
  identityVerification,
  mortgageBankStatus,
  managementCancel,
  guaranteeTransfer,
  keyStatus,
  accountTransfer,
} from "../types/property";

// ==================== テーブル定義 ====================

/**
 * 案件テーブル
 * 1R投資用不動産の売買案件を管理します。
 * A（オーナー）→ B（グループ会社）→ C（買主）の取引フローにおける、
 * 物件情報、金額、契約日、進捗状況などを一元管理します。
 */
export const properties = sqliteTable(
  "properties",
  {
    id,
    propertyName: text("property_name").notNull(),
    roomNumber: text("room_number"),
    ownerName: text("owner_name").notNull(),
    amountA: real("amount_a"),
    amountExit: real("amount_exit"),
    commission: real("commission"),
    profit: real("profit"),
    bcDeposit: real("bc_deposit"),
    contractDateA: customTimestampNullable("contract_date_a"),
    contractDateBc: customTimestampNullable("contract_date_bc"),
    settlementDate: customTimestampNullable("settlement_date"),
    contractType: text("contract_type", { enum: contractType }),
    companyB: text("company_b", { enum: companyB }),
    brokerCompany: text("broker_company", { enum: brokerCompany }),
    buyerCompany: text("buyer_company"),
    mortgageBank: text("mortgage_bank"),
    listType: text("list_type"),
    progressStatus: text("progress_status", { enum: progressStatus })
      .notNull()
      .default("bc_before_confirmed"),
    documentStatus: text("document_status", { enum: documentStatus })
      .notNull()
      .default("waiting_request"),
    notes: text("notes"),
    accountCompany: text("account_company", { enum: accountCompany }),
    bankAccount: text("bank_account", { enum: bankAccount }),
    createdBy: text("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    updatedBy: text("updated_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps(),
  },
  (table) => [
    index("idx_properties_progress_status").on(table.progressStatus),
    index("idx_properties_document_status").on(table.documentStatus),
    index("idx_properties_settlement_date").on(table.settlementDate),
    index("idx_properties_created_at").on(table.createdAt),
  ]
);

/**
 * 案件担当者中間テーブル
 * 案件と担当者の紐付けを管理する中間テーブル。
 * 1つの案件に複数の営業担当や事務担当を割り当てることができます。
 */
export const propertyStaff = sqliteTable(
  "property_staff",
  {
    id,
    propertyId: text("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: customTimestamp("created_at"),
  },
  (table) => [
    index("idx_property_staff_property_id").on(table.propertyId),
    index("idx_property_staff_user_id").on(table.userId),
    unique("uk_property_staff_property_user").on(
      table.propertyId,
      table.userId
    ),
  ]
);

/**
 * 契約進捗テーブル
 * 契約関連のチェック項目を管理するテーブル。
 * AB契約（オーナーとの契約）とBC契約（買主との契約）それぞれの
 * 契約書作成・送付・チェックバックの進捗を管理します。
 */
export const contractProgress = sqliteTable("contract_progress", {
  id,
  propertyId: text("property_id")
    .notNull()
    .unique("uk_contract_progress_property_id")
    .references(() => properties.id, { onDelete: "cascade" }),
  abContractSaved: integer("ab_contract_saved", { mode: "boolean" })
    .notNull()
    .default(false),
  abContractSavedAt: customTimestampNullable("ab_contract_saved_at"),
  abContractSavedBy: text("ab_contract_saved_by").references(() => users.id),
  abAuthorizationSaved: integer("ab_authorization_saved", { mode: "boolean" })
    .notNull()
    .default(false),
  abAuthorizationSavedAt: customTimestampNullable("ab_authorization_saved_at"),
  abAuthorizationSavedBy: text("ab_authorization_saved_by").references(
    () => users.id
  ),
  abSellerIdSaved: integer("ab_seller_id_saved", { mode: "boolean" })
    .notNull()
    .default(false),
  abSellerIdSavedAt: customTimestampNullable("ab_seller_id_saved_at"),
  abSellerIdSavedBy: text("ab_seller_id_saved_by").references(() => users.id),
  bcContractCreated: integer("bc_contract_created", { mode: "boolean" })
    .notNull()
    .default(false),
  bcContractCreatedAt: customTimestampNullable("bc_contract_created_at"),
  bcContractCreatedBy: text("bc_contract_created_by").references(
    () => users.id
  ),
  bcDescriptionCreated: integer("bc_description_created", { mode: "boolean" })
    .notNull()
    .default(false),
  bcDescriptionCreatedAt: customTimestampNullable("bc_description_created_at"),
  bcDescriptionCreatedBy: text("bc_description_created_by").references(
    () => users.id
  ),
  bcContractSent: integer("bc_contract_sent", { mode: "boolean" })
    .notNull()
    .default(false),
  bcContractSentAt: customTimestampNullable("bc_contract_sent_at"),
  bcContractSentBy: text("bc_contract_sent_by").references(() => users.id),
  bcDescriptionSent: integer("bc_description_sent", { mode: "boolean" })
    .notNull()
    .default(false),
  bcDescriptionSentAt: customTimestampNullable("bc_description_sent_at"),
  bcDescriptionSentBy: text("bc_description_sent_by").references(
    () => users.id
  ),
  bcContractCbDone: integer("bc_contract_cb_done", { mode: "boolean" })
    .notNull()
    .default(false),
  bcContractCbDoneAt: customTimestampNullable("bc_contract_cb_done_at"),
  bcContractCbDoneBy: text("bc_contract_cb_done_by").references(() => users.id),
  bcDescriptionCbDone: integer("bc_description_cb_done", { mode: "boolean" })
    .notNull()
    .default(false),
  bcDescriptionCbDoneAt: customTimestampNullable("bc_description_cb_done_at"),
  bcDescriptionCbDoneBy: text("bc_description_cb_done_by").references(
    () => users.id
  ),
  ...timestamps(),
});

/**
 * 書類進捗テーブル（MVP簡易版）
 * 書類取得の進捗を管理するテーブル。
 * MVPでは「営業依頼待ち」「書類取得中」「全書類取得完了」の3段階で簡易的に管理します。
 */
export const documentProgress = sqliteTable("document_progress", {
  id,
  propertyId: text("property_id")
    .notNull()
    .unique("uk_document_progress_property_id")
    .references(() => properties.id, { onDelete: "cascade" }),
  status: text("status", { enum: documentStatus })
    .notNull()
    .default("waiting_request"),
  updatedBy: text("updated_by")
    .notNull()
    .references(() => users.id),
  ...timestamps(),
});

/**
 * 決済進捗テーブル
 * 決済関連のチェック項目を管理するテーブル。
 * 精算書の作成・送付、司法書士への依頼、抵当銀行との調整、
 * 管理会社の解約手続き、鍵の受け渡しなど、決済完了までに必要な
 * 全ての作業項目をチェックリスト形式で管理します。
 */
export const settlementProgress = sqliteTable("settlement_progress", {
  id,
  propertyId: text("property_id")
    .notNull()
    .unique("uk_settlement_progress_property_id")
    .references(() => properties.id, { onDelete: "cascade" }),
  bcSettlementStatus: text("bc_settlement_status", { enum: bcSettlementStatus })
    .notNull()
    .default("not_created"),
  abSettlementStatus: text("ab_settlement_status", { enum: abSettlementStatus })
    .notNull()
    .default("not_created"),
  loanCalculationSaved: integer("loan_calculation_saved", { mode: "boolean" })
    .notNull()
    .default(false),
  loanCalculationSavedAt: customTimestampNullable("loan_calculation_saved_at"),
  loanCalculationSavedBy: text("loan_calculation_saved_by").references(
    () => users.id
  ),
  lawyerRequested: integer("lawyer_requested", { mode: "boolean" })
    .notNull()
    .default(false),
  lawyerRequestedAt: customTimestampNullable("lawyer_requested_at"),
  lawyerRequestedBy: text("lawyer_requested_by").references(() => users.id),
  documentsShared: integer("documents_shared", { mode: "boolean" })
    .notNull()
    .default(false),
  documentsSharedAt: customTimestampNullable("documents_shared_at"),
  documentsSharedBy: text("documents_shared_by").references(() => users.id),
  identityVerification: text("identity_verification", {
    enum: identityVerification,
  })
    .notNull()
    .default("none"),
  documentsComplete: integer("documents_complete", { mode: "boolean" })
    .notNull()
    .default(false),
  documentsCompleteAt: customTimestampNullable("documents_complete_at"),
  documentsCompleteBy: text("documents_complete_by").references(() => users.id),
  mortgageBankStatus: text("mortgage_bank_status", {
    enum: mortgageBankStatus,
  })
    .notNull()
    .default("none"),
  bankDocumentsComplete: integer("bank_documents_complete", { mode: "boolean" })
    .notNull()
    .default(false),
  bankDocumentsCompleteAt: customTimestampNullable(
    "bank_documents_complete_at"
  ),
  bankDocumentsCompleteBy: text("bank_documents_complete_by").references(
    () => users.id
  ),
  loanSaved: integer("loan_saved", { mode: "boolean" })
    .notNull()
    .default(false),
  loanSavedAt: customTimestampNullable("loan_saved_at"),
  loanSavedBy: text("loan_saved_by").references(() => users.id),
  sellerPaymentDone: integer("seller_payment_done", { mode: "boolean" })
    .notNull()
    .default(false),
  sellerPaymentDoneAt: customTimestampNullable("seller_payment_done_at"),
  sellerPaymentDoneBy: text("seller_payment_done_by").references(
    () => users.id
  ),
  managementCancel: text("management_cancel", { enum: managementCancel })
    .notNull()
    .default("none"),
  guaranteeTransfer: text("guarantee_transfer", { enum: guaranteeTransfer })
    .notNull()
    .default("none"),
  keyStatus: text("key_status", { enum: keyStatus }).notNull().default("none"),
  accountTransfer: text("account_transfer", { enum: accountTransfer })
    .notNull()
    .default("none"),
  ledgerEntry: integer("ledger_entry", { mode: "boolean" })
    .notNull()
    .default(false),
  ledgerEntryAt: customTimestampNullable("ledger_entry_at"),
  ledgerEntryBy: text("ledger_entry_by").references(() => users.id),
  ...timestamps(),
});

/**
 * 案件進捗履歴テーブル
 * 案件の進捗ステータス変更履歴を記録するテーブル。
 * 案件のメイン進捗ステータスが変更された際に、変更前・変更後のステータス、
 * 変更日時、変更者を自動的に記録します。
 */
export const propertyProgressHistory = sqliteTable(
  "property_progress_history",
  {
    id,
    propertyId: text("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    fromStatus: text("from_status", { enum: progressStatus }),
    toStatus: text("to_status", { enum: progressStatus }).notNull(),
    changedBy: text("changed_by")
      .notNull()
      .references(() => users.id),
    changedAt: customTimestamp("changed_at"),
  },
  (table) => [
    index("idx_property_progress_history_property_id").on(table.propertyId),
    index("idx_property_progress_history_changed_at").on(table.changedAt),
  ]
);

// リレーション定義

export const propertiesRelations = relations(properties, ({ many, one }) => ({
  staff: many(propertyStaff),
  contractProgress: one(contractProgress, {
    fields: [properties.id],
    references: [contractProgress.propertyId],
  }),
  documentProgress: one(documentProgress, {
    fields: [properties.id],
    references: [documentProgress.propertyId],
  }),
  settlementProgress: one(settlementProgress, {
    fields: [properties.id],
    references: [settlementProgress.propertyId],
  }),
  progressHistory: many(propertyProgressHistory),
  createdByUser: one(users, {
    fields: [properties.createdBy],
    references: [users.id],
    relationName: "propertyCreatedBy",
  }),
  updatedByUser: one(users, {
    fields: [properties.updatedBy],
    references: [users.id],
    relationName: "propertyUpdatedBy",
  }),
}));

export const propertyStaffRelations = relations(propertyStaff, ({ one }) => ({
  property: one(properties, {
    fields: [propertyStaff.propertyId],
    references: [properties.id],
  }),
  user: one(users, {
    fields: [propertyStaff.userId],
    references: [users.id],
  }),
}));

export const contractProgressRelations = relations(
  contractProgress,
  ({ one }) => ({
    property: one(properties, {
      fields: [contractProgress.propertyId],
      references: [properties.id],
    }),
  })
);

export const documentProgressRelations = relations(
  documentProgress,
  ({ one }) => ({
    property: one(properties, {
      fields: [documentProgress.propertyId],
      references: [properties.id],
    }),
    updatedByUser: one(users, {
      fields: [documentProgress.updatedBy],
      references: [users.id],
    }),
  })
);

export const settlementProgressRelations = relations(
  settlementProgress,
  ({ one }) => ({
    property: one(properties, {
      fields: [settlementProgress.propertyId],
      references: [properties.id],
    }),
  })
);

export const propertyProgressHistoryRelations = relations(
  propertyProgressHistory,
  ({ one }) => ({
    property: one(properties, {
      fields: [propertyProgressHistory.propertyId],
      references: [properties.id],
    }),
    changedByUser: one(users, {
      fields: [propertyProgressHistory.changedBy],
      references: [users.id],
    }),
  })
);
