import { relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  unique,
  index,
} from "drizzle-orm/sqlite-core";
import { timestamps, id } from "../util";
import { users, organizations } from "./auth";
import {
  bcSettlementStatus,
  abSettlementStatus,
  identityVerification,
  mortgageBankStatus,
  managementCancel,
  guaranteeTransfer,
  keyStatus,
  accountTransfer,
  mortgageCancellation,
  identityVerificationMethod,
  identityVerificationCall,
  identityVerificationStatus,
  sellerFundingStatus,
  subleaseSuccession,
  rentalContractAndKey,
  guaranteeCompanySuccession,
} from "../types/property";

// ==================== Enum定義 ====================

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
/** 書類ステータス */
export const documentStatus = [
  "waiting_request",
  "in_progress",
  "completed",
] as const;
/** 使用口座会社 */
export const accountCompany = ["legit", "life", "ms"] as const;
/** 使用銀行口座 */
export const bankAccount = [
  // レイジット (legit)
  "gmo_main",
  "gmo_sub",
  "kinsan",
  // ライフ (life)
  "main_1727088",
  "sub_1728218",
  "new_main_2309414",
  // エムズ (ms)
  "sumi_shin",
  // "gmo_main", // レイジットと重複するためコメントアウト
  // "gmo_sub",  // レイジットと重複するためコメントアウト
  "rakuten",
  "paypay_1",
  "paypay_2",
  "paypay_3",
] as const;
/** 仲介会社の値 */
export const brokerCompany = [
  "legit",
  "tousei",
  "ms",
  "rd",
  "nbf",
  "shine",
  "esc",
  "none",
] as const;
/** B会社 */
export const companyB = [
  "legit",
  "life",
  "ms",
  "second",
  // "shine",
  "trader",
  "esc",
] as const;
/** 契約形態 */
export const contractType = [
  "ab_bc",
  "ac",
  "iyaku",
  "hakushi",
  "mitei",
  "jisha",
  "bengoshi",
  "kaichu",
  "iyaku_yotei",
] as const;
/** マイソク配布ステータス */
export const maisokuDistributionStatus = [
  "not_distributed",
  "distributed",
] as const;

/** 書類項目ステータス */
export const documentItemStatus = [
  "not_requested",
  "requesting",
  "acquired",
  "not_required",
] as const;

/** 書類項目種別（銀行関係） */
export const documentItemTypeBank = ["loan_calculation"] as const;

/** 書類項目種別（賃貸管理関係） */
export const documentItemTypeRentalManagement = [
  "rental_contract",
  "management_contract",
  "move_in_application",
] as const;

/** 書類項目種別（建物管理関係） */
export const documentItemTypeBuildingManagement = [
  "important_matters_report",
  "management_rules",
  "long_term_repair_plan",
  "general_meeting_minutes",
  "pamphlet",
  "bank_transfer_form",
  "owner_change_notification",
] as const;

/** 書類項目種別（役所関係） */
export const documentItemTypeGovernment = [
  "tax_certificate",
  "building_plan_overview",
  "ledger_certificate",
  "zoning_district",
  "road_ledger",
] as const;

/** 書類項目種別（全体） */
export const documentItemType = [
  ...documentItemTypeBank,
  ...documentItemTypeRentalManagement,
  ...documentItemTypeBuildingManagement,
  ...documentItemTypeGovernment,
] as const;

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
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    propertyName: text("property_name").notNull(),
    roomNumber: text("room_number"),
    ownerName: text("owner_name").notNull(),
    amountA: real("amount_a"), // A金額（入口金額）
    amountExit: real("amount_exit"), // 出口金額
    commission: real("commission"), // 仲介手数料等
    profit: real("profit"), // 利益（出口金額 - A金額 + 仲手等）※アプリケーション側で自動計算
    bcDeposit: real("bc_deposit"), // BC手付金額
    contractDateA: integer("contract_date_a", { mode: "timestamp_ms" }),
    contractDateAUpdatedAt: integer("contract_date_a_updated_at", {
      mode: "timestamp_ms",
    }),
    contractDateAUpdatedBy: text("contract_date_a_updated_by").references(
      () => users.id,
      { onDelete: "set null" }
    ),
    contractDateBc: integer("contract_date_bc", { mode: "timestamp_ms" }),
    contractDateBcUpdatedAt: integer("contract_date_bc_updated_at", {
      mode: "timestamp_ms",
    }),
    contractDateBcUpdatedBy: text("contract_date_bc_updated_by").references(
      () => users.id,
      { onDelete: "set null" }
    ),
    settlementDate: integer("settlement_date", { mode: "timestamp_ms" }), // 決済日
    settlementDateUpdatedAt: integer("settlement_date_updated_at", {
      mode: "timestamp_ms",
    }),
    settlementDateUpdatedBy: text("settlement_date_updated_by").references(
      () => users.id,
      { onDelete: "set null" }
    ),
    contractType: text("contract_type", { enum: contractType }),
    companyB: text("company_b", { enum: companyB }),
    brokerCompany: text("broker_company", { enum: brokerCompany }),
    buyerCompany: text("buyer_company"),
    mortgageBank: text("mortgage_bank"),
    listType: text("list_type"),
    progressStatus: text("progress_status", { enum: progressStatus })
      .notNull()
      .default("bc_before_confirmed"),
    progressStatusUpdatedAt: integer("progress_status_updated_at", {
      mode: "timestamp_ms",
    }),
    progressStatusUpdatedBy: text("progress_status_updated_by").references(
      () => users.id,
      { onDelete: "set null" }
    ),
    documentStatus: text("document_status", { enum: documentStatus })
      .notNull()
      .default("waiting_request"),
    documentStatusUpdatedAt: integer("document_status_updated_at", {
      mode: "timestamp_ms",
    }),
    documentStatusUpdatedBy: text("document_status_updated_by").references(
      () => users.id,
      { onDelete: "set null" }
    ),
    notes: text("notes"),
    accountCompany: text("account_company", { enum: accountCompany }),
    bankAccount: text("bank_account", { enum: bankAccount }),
    createdBy: text("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    updatedBy: text("updated_by").references(() => users.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (table) => [
    index("idx_properties_organization_id").on(table.organizationId),
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
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamps.createdAt,
  },
  (table) => [
    index("idx_property_staff_property_id").on(table.propertyId),
    index("idx_property_staff_user_id").on(table.userId),
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
  // マイソク配布
  maisokuDistribution: text("maisoku_distribution", {
    enum: maisokuDistributionStatus,
  })
    .notNull()
    .default("not_distributed"),
  maisokuDistributionAt: integer("maisoku_distribution_at", {
    mode: "timestamp_ms",
  }),
  maisokuDistributionBy: text("maisoku_distribution_by").references(
    () => users.id,
    { onDelete: "set null" }
  ),
  abContractSaved: integer("ab_contract_saved", { mode: "boolean" })
    .notNull()
    .default(false),
  abContractSavedAt: integer("ab_contract_saved_at", { mode: "timestamp_ms" }),
  abContractSavedBy: text("ab_contract_saved_by").references(() => users.id, {
    onDelete: "set null",
  }),
  abAuthorizationSaved: integer("ab_authorization_saved", { mode: "boolean" })
    .notNull()
    .default(false),
  abAuthorizationSavedAt: integer("ab_authorization_saved_at", {
    mode: "timestamp_ms",
  }),
  abAuthorizationSavedBy: text("ab_authorization_saved_by").references(
    () => users.id,
    { onDelete: "set null" }
  ),
  abSellerIdSaved: integer("ab_seller_id_saved", { mode: "boolean" })
    .notNull()
    .default(false),
  abSellerIdSavedAt: integer("ab_seller_id_saved_at", { mode: "timestamp_ms" }),
  abSellerIdSavedBy: text("ab_seller_id_saved_by").references(() => users.id, {
    onDelete: "set null",
  }),
  bcContractCreated: integer("bc_contract_created", { mode: "boolean" })
    .notNull()
    .default(false),
  bcContractCreatedAt: integer("bc_contract_created_at", {
    mode: "timestamp_ms",
  }),
  bcContractCreatedBy: text("bc_contract_created_by").references(
    () => users.id,
    { onDelete: "set null" }
  ),
  bcDescriptionCreated: integer("bc_description_created", { mode: "boolean" })
    .notNull()
    .default(false),
  bcDescriptionCreatedAt: integer("bc_description_created_at", {
    mode: "timestamp_ms",
  }),
  bcDescriptionCreatedBy: text("bc_description_created_by").references(
    () => users.id,
    { onDelete: "set null" }
  ),
  bcContractSent: integer("bc_contract_sent", { mode: "boolean" })
    .notNull()
    .default(false),
  bcContractSentAt: integer("bc_contract_sent_at", { mode: "timestamp_ms" }),
  bcContractSentBy: text("bc_contract_sent_by").references(() => users.id, {
    onDelete: "set null",
  }),
  bcDescriptionSent: integer("bc_description_sent", { mode: "boolean" })
    .notNull()
    .default(false),
  bcDescriptionSentAt: integer("bc_description_sent_at", {
    mode: "timestamp_ms",
  }),
  bcDescriptionSentBy: text("bc_description_sent_by").references(
    () => users.id,
    { onDelete: "set null" }
  ),
  bcContractCbDone: integer("bc_contract_cb_done", { mode: "boolean" })
    .notNull()
    .default(false),
  bcContractCbDoneAt: integer("bc_contract_cb_done_at", {
    mode: "timestamp_ms",
  }),
  bcContractCbDoneBy: text("bc_contract_cb_done_by").references(
    () => users.id,
    { onDelete: "set null" }
  ),
  bcDescriptionCbDone: integer("bc_description_cb_done", { mode: "boolean" })
    .notNull()
    .default(false),
  bcDescriptionCbDoneAt: integer("bc_description_cb_done_at", {
    mode: "timestamp_ms",
  }),
  bcDescriptionCbDoneBy: text("bc_description_cb_done_by").references(
    () => users.id,
    { onDelete: "set null" }
  ),
  ...timestamps,
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
  updatedBy: text("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
  ...timestamps,
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
  bcSettlementStatusAt: integer("bc_settlement_status_at", {
    mode: "timestamp_ms",
  }),
  bcSettlementStatusBy: text("bc_settlement_status_by").references(
    () => users.id,
    { onDelete: "set null" }
  ),
  abSettlementStatus: text("ab_settlement_status", { enum: abSettlementStatus })
    .notNull()
    .default("not_created"),
  abSettlementStatusAt: integer("ab_settlement_status_at", {
    mode: "timestamp_ms",
  }),
  abSettlementStatusBy: text("ab_settlement_status_by").references(
    () => users.id,
    { onDelete: "set null" }
  ),
  loanCalculationSaved: integer("loan_calculation_saved", { mode: "boolean" })
    .notNull()
    .default(false),
  loanCalculationSavedAt: integer("loan_calculation_saved_at", {
    mode: "timestamp_ms",
  }),
  loanCalculationSavedBy: text("loan_calculation_saved_by").references(
    () => users.id,
    { onDelete: "set null" }
  ),
  lawyerRequested: integer("lawyer_requested", { mode: "boolean" })
    .notNull()
    .default(false),
  lawyerRequestedAt: integer("lawyer_requested_at", { mode: "timestamp_ms" }),
  lawyerRequestedBy: text("lawyer_requested_by").references(() => users.id, {
    onDelete: "set null",
  }),
  documentsShared: integer("documents_shared", { mode: "boolean" })
    .notNull()
    .default(false),
  documentsSharedAt: integer("documents_shared_at", { mode: "timestamp_ms" }),
  documentsSharedBy: text("documents_shared_by").references(() => users.id, {
    onDelete: "set null",
  }),
  // 賃貸管理関係 - 管理解約予定月
  managementCancelScheduledMonth: text("management_cancel_scheduled_month"),
  managementCancelScheduledMonthAt: integer(
    "management_cancel_scheduled_month_at",
    { mode: "timestamp_ms" }
  ),
  managementCancelScheduledMonthBy: text(
    "management_cancel_scheduled_month_by"
  ).references(() => users.id, { onDelete: "set null" }),
  // 賃貸管理関係 - 管理解約依頼日
  managementCancelRequestedDate: text("management_cancel_requested_date"),
  managementCancelRequestedDateAt: integer(
    "management_cancel_requested_date_at",
    { mode: "timestamp_ms" }
  ),
  managementCancelRequestedDateBy: text(
    "management_cancel_requested_date_by"
  ).references(() => users.id, { onDelete: "set null" }),
  // 賃貸管理関係 - 管理解約完了日
  managementCancelCompletedDate: text("management_cancel_completed_date"),
  managementCancelCompletedDateAt: integer(
    "management_cancel_completed_date_at",
    { mode: "timestamp_ms" }
  ),
  managementCancelCompletedDateBy: text(
    "management_cancel_completed_date_by"
  ).references(() => users.id, { onDelete: "set null" }),
  identityVerification: text("identity_verification", {
    enum: identityVerification,
  })
    .notNull()
    .default("none"),
  documentsComplete: integer("documents_complete", { mode: "boolean" })
    .notNull()
    .default(false),
  documentsCompleteAt: integer("documents_complete_at", {
    mode: "timestamp_ms",
  }),
  documentsCompleteBy: text("documents_complete_by").references(
    () => users.id,
    { onDelete: "set null" }
  ),
  mortgageBankStatus: text("mortgage_bank_status", {
    enum: mortgageBankStatus,
  })
    .notNull()
    .default("none"),
  bankDocumentsComplete: integer("bank_documents_complete", { mode: "boolean" })
    .notNull()
    .default(false),
  bankDocumentsCompleteAt: integer("bank_documents_complete_at", {
    mode: "timestamp_ms",
  }),
  bankDocumentsCompleteBy: text("bank_documents_complete_by").references(
    () => users.id,
    { onDelete: "set null" }
  ),
  loanSaved: integer("loan_saved", { mode: "boolean" })
    .notNull()
    .default(false),
  loanSavedAt: integer("loan_saved_at", { mode: "timestamp_ms" }),
  loanSavedBy: text("loan_saved_by").references(() => users.id, {
    onDelete: "set null",
  }),
  sellerPaymentDone: integer("seller_payment_done", { mode: "boolean" })
    .notNull()
    .default(false),
  sellerPaymentDoneAt: integer("seller_payment_done_at", {
    mode: "timestamp_ms",
  }),
  sellerPaymentDoneBy: text("seller_payment_done_by").references(
    () => users.id,
    { onDelete: "set null" }
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
  ledgerEntryAt: integer("ledger_entry_at", { mode: "timestamp_ms" }),
  ledgerEntryBy: text("ledger_entry_by").references(() => users.id, {
    onDelete: "set null",
  }),
  // ==================== 2026-01-17 変更要求追加項目 ====================
  // 銀行関連 - 抵当権抹消
  mortgageCancellation: text("mortgage_cancellation", {
    enum: mortgageCancellation,
  }).default("not_requested"),
  mortgageCancellationAt: integer("mortgage_cancellation_at", {
    mode: "timestamp_ms",
  }),
  mortgageCancellationBy: text("mortgage_cancellation_by").references(
    () => users.id,
    { onDelete: "set null" }
  ),
  // 司法書士関連 - 権利証
  propertyTitle: integer("property_title", { mode: "boolean" }),
  propertyTitleAt: integer("property_title_at", { mode: "timestamp_ms" }),
  propertyTitleBy: text("property_title_by").references(() => users.id, {
    onDelete: "set null",
  }),
  // 司法書士関連 - 住所変更
  addressChange: integer("address_change", { mode: "boolean" }),
  addressChangeAt: integer("address_change_at", { mode: "timestamp_ms" }),
  addressChangeBy: text("address_change_by").references(() => users.id, {
    onDelete: "set null",
  }),
  // 司法書士関連 - 氏名変更
  nameChange: integer("name_change", { mode: "boolean" }),
  nameChangeAt: integer("name_change_at", { mode: "timestamp_ms" }),
  nameChangeBy: text("name_change_by").references(() => users.id, {
    onDelete: "set null",
  }),
  // 司法書士関連 - 本人確認方法
  identityVerificationMethod: text("identity_verification_method", {
    enum: identityVerificationMethod,
  }),
  identityVerificationMethodAt: integer("identity_verification_method_at", {
    mode: "timestamp_ms",
  }),
  identityVerificationMethodBy: text(
    "identity_verification_method_by"
  ).references(() => users.id, { onDelete: "set null" }),
  // 司法書士関連 - 本人確認電話
  identityVerificationCall: text("identity_verification_call", {
    enum: identityVerificationCall,
  }).default("not_requested"),
  identityVerificationCallAt: integer("identity_verification_call_at", {
    mode: "timestamp_ms",
  }),
  identityVerificationCallBy: text("identity_verification_call_by").references(
    () => users.id,
    { onDelete: "set null" }
  ),
  // 司法書士関連 - 本人確認電話日時
  identityVerificationCallSchedule: text("identity_verification_call_schedule"),
  identityVerificationCallScheduleAt: integer(
    "identity_verification_call_schedule_at",
    { mode: "timestamp_ms" }
  ),
  identityVerificationCallScheduleBy: text(
    "identity_verification_call_schedule_by"
  ).references(() => users.id, { onDelete: "set null" }),
  // 司法書士関連 - 本人確認ステータス
  identityVerificationStatus: text("identity_verification_status", {
    enum: identityVerificationStatus,
  }).default("not_started"),
  identityVerificationStatusAt: integer("identity_verification_status_at", {
    mode: "timestamp_ms",
  }),
  identityVerificationStatusBy: text(
    "identity_verification_status_by"
  ).references(() => users.id, { onDelete: "set null" }),
  // 手出し関係 - 手出し状況
  sellerFundingStatus: text("seller_funding_status", {
    enum: sellerFundingStatus,
  }).default("not_required"),
  sellerFundingStatusAt: integer("seller_funding_status_at", {
    mode: "timestamp_ms",
  }),
  sellerFundingStatusBy: text("seller_funding_status_by").references(
    () => users.id,
    { onDelete: "set null" }
  ),
  // 賃管関係 - サブリース承継
  subleaseSuccession: text("sublease_succession", {
    enum: subleaseSuccession,
  }).default("not_required"),
  subleaseSuccessionAt: integer("sublease_succession_at", {
    mode: "timestamp_ms",
  }),
  subleaseSuccessionBy: text("sublease_succession_by").references(
    () => users.id,
    { onDelete: "set null" }
  ),
  // 賃管関係 - 賃契原本＆鍵
  rentalContractAndKey: text("rental_contract_and_key", {
    enum: rentalContractAndKey,
  }).default("not_requested"),
  rentalContractAndKeyAt: integer("rental_contract_and_key_at", {
    mode: "timestamp_ms",
  }),
  rentalContractAndKeyBy: text("rental_contract_and_key_by").references(
    () => users.id,
    { onDelete: "set null" }
  ),
  // 賃管関係 - 保証会社承継
  guaranteeCompanySuccession: text("guarantee_company_succession", {
    enum: guaranteeCompanySuccession,
  }).default("not_required"),
  guaranteeCompanySuccessionAt: integer("guarantee_company_succession_at", {
    mode: "timestamp_ms",
  }),
  guaranteeCompanySuccessionBy: text(
    "guarantee_company_succession_by"
  ).references(() => users.id, { onDelete: "set null" }),
  ...timestamps,
});

/**
 * 書類項目テーブル
 * 案件ごとの各書類項目のステータスを管理するテーブル。
 * 銀行関係、賃貸管理関係、建物管理関係、役所関係の4カテゴリの書類項目を管理します。
 */
export const propertyDocumentItems = sqliteTable(
  "property_document_items",
  {
    id,
    propertyId: text("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    itemType: text("item_type", { enum: documentItemType }).notNull(),
    status: text("status", { enum: documentItemStatus })
      .notNull()
      .default("not_requested"),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }),
    updatedBy: text("updated_by").references(() => users.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    index("idx_property_document_items_property_id").on(table.propertyId),
    unique("uk_property_document_items_property_item").on(
      table.propertyId,
      table.itemType
    ),
  ]
);

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
    changedBy: text("changed_by").references(() => users.id, {
      onDelete: "set null",
    }),
    changedAt: integer("changed_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
  },
  (table) => [
    index("idx_property_progress_history_property_id").on(table.propertyId),
    index("idx_property_progress_history_changed_at").on(table.changedAt),
  ]
);

// リレーション定義

export const propertiesRelations = relations(properties, ({ many, one }) => ({
  organization: one(organizations, {
    fields: [properties.organizationId],
    references: [organizations.id],
  }),
  staff: many(propertyStaff),
  contractProgress: one(contractProgress, {
    fields: [properties.id],
    references: [contractProgress.propertyId],
  }),
  documentProgress: one(documentProgress, {
    fields: [properties.id],
    references: [documentProgress.propertyId],
  }),
  documentItems: many(propertyDocumentItems),
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
  // 進捗ステータス更新者
  progressStatusUpdatedByUser: one(users, {
    fields: [properties.progressStatusUpdatedBy],
    references: [users.id],
    relationName: "progressStatusUpdatedBy",
  }),
  // 書類ステータス更新者
  documentStatusUpdatedByUser: one(users, {
    fields: [properties.documentStatusUpdatedBy],
    references: [users.id],
    relationName: "documentStatusUpdatedBy",
  }),
  // スケジュール更新者
  contractDateAUpdatedByUser: one(users, {
    fields: [properties.contractDateAUpdatedBy],
    references: [users.id],
    relationName: "contractDateAUpdatedBy",
  }),
  contractDateBcUpdatedByUser: one(users, {
    fields: [properties.contractDateBcUpdatedBy],
    references: [users.id],
    relationName: "contractDateBcUpdatedBy",
  }),
  settlementDateUpdatedByUser: one(users, {
    fields: [properties.settlementDateUpdatedBy],
    references: [users.id],
    relationName: "settlementDateUpdatedBy",
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
    // マイソク配布の更新者ユーザー
    maisokuDistributionByUser: one(users, {
      fields: [contractProgress.maisokuDistributionBy],
      references: [users.id],
      relationName: "maisokuDistributionBy",
    }),
    // AB関係の更新者ユーザー
    abContractSavedByUser: one(users, {
      fields: [contractProgress.abContractSavedBy],
      references: [users.id],
      relationName: "abContractSavedBy",
    }),
    abAuthorizationSavedByUser: one(users, {
      fields: [contractProgress.abAuthorizationSavedBy],
      references: [users.id],
      relationName: "abAuthorizationSavedBy",
    }),
    abSellerIdSavedByUser: one(users, {
      fields: [contractProgress.abSellerIdSavedBy],
      references: [users.id],
      relationName: "abSellerIdSavedBy",
    }),
    // BC関係の更新者ユーザー
    bcContractCreatedByUser: one(users, {
      fields: [contractProgress.bcContractCreatedBy],
      references: [users.id],
      relationName: "bcContractCreatedBy",
    }),
    bcDescriptionCreatedByUser: one(users, {
      fields: [contractProgress.bcDescriptionCreatedBy],
      references: [users.id],
      relationName: "bcDescriptionCreatedBy",
    }),
    bcContractSentByUser: one(users, {
      fields: [contractProgress.bcContractSentBy],
      references: [users.id],
      relationName: "bcContractSentBy",
    }),
    bcDescriptionSentByUser: one(users, {
      fields: [contractProgress.bcDescriptionSentBy],
      references: [users.id],
      relationName: "bcDescriptionSentBy",
    }),
    bcContractCbDoneByUser: one(users, {
      fields: [contractProgress.bcContractCbDoneBy],
      references: [users.id],
      relationName: "bcContractCbDoneBy",
    }),
    bcDescriptionCbDoneByUser: one(users, {
      fields: [contractProgress.bcDescriptionCbDoneBy],
      references: [users.id],
      relationName: "bcDescriptionCbDoneBy",
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

export const propertyDocumentItemsRelations = relations(
  propertyDocumentItems,
  ({ one }) => ({
    property: one(properties, {
      fields: [propertyDocumentItems.propertyId],
      references: [properties.id],
    }),
    updatedByUser: one(users, {
      fields: [propertyDocumentItems.updatedBy],
      references: [users.id],
      relationName: "documentItemUpdatedBy",
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
    // 精算書関係の更新者ユーザー
    bcSettlementStatusByUser: one(users, {
      fields: [settlementProgress.bcSettlementStatusBy],
      references: [users.id],
      relationName: "bcSettlementStatusBy",
    }),
    abSettlementStatusByUser: one(users, {
      fields: [settlementProgress.abSettlementStatusBy],
      references: [users.id],
      relationName: "abSettlementStatusBy",
    }),
    // 司法書士関係の更新者ユーザー
    lawyerRequestedByUser: one(users, {
      fields: [settlementProgress.lawyerRequestedBy],
      references: [users.id],
      relationName: "lawyerRequestedBy",
    }),
    documentsSharedByUser: one(users, {
      fields: [settlementProgress.documentsSharedBy],
      references: [users.id],
      relationName: "documentsSharedBy",
    }),
    // 賃貸管理関係の更新者ユーザー
    managementCancelScheduledMonthByUser: one(users, {
      fields: [settlementProgress.managementCancelScheduledMonthBy],
      references: [users.id],
      relationName: "managementCancelScheduledMonthBy",
    }),
    managementCancelRequestedDateByUser: one(users, {
      fields: [settlementProgress.managementCancelRequestedDateBy],
      references: [users.id],
      relationName: "managementCancelRequestedDateBy",
    }),
    managementCancelCompletedDateByUser: one(users, {
      fields: [settlementProgress.managementCancelCompletedDateBy],
      references: [users.id],
      relationName: "managementCancelCompletedDateBy",
    }),
    // ==================== 2026-01-17 変更要求追加項目の更新者 ====================
    // 銀行関連
    mortgageCancellationByUser: one(users, {
      fields: [settlementProgress.mortgageCancellationBy],
      references: [users.id],
      relationName: "mortgageCancellationBy",
    }),
    loanCalculationSavedByUser: one(users, {
      fields: [settlementProgress.loanCalculationSavedBy],
      references: [users.id],
      relationName: "loanCalculationSavedBy",
    }),
    // 司法書士関連
    propertyTitleByUser: one(users, {
      fields: [settlementProgress.propertyTitleBy],
      references: [users.id],
      relationName: "propertyTitleBy",
    }),
    addressChangeByUser: one(users, {
      fields: [settlementProgress.addressChangeBy],
      references: [users.id],
      relationName: "addressChangeBy",
    }),
    nameChangeByUser: one(users, {
      fields: [settlementProgress.nameChangeBy],
      references: [users.id],
      relationName: "nameChangeBy",
    }),
    identityVerificationMethodByUser: one(users, {
      fields: [settlementProgress.identityVerificationMethodBy],
      references: [users.id],
      relationName: "identityVerificationMethodBy",
    }),
    identityVerificationCallByUser: one(users, {
      fields: [settlementProgress.identityVerificationCallBy],
      references: [users.id],
      relationName: "identityVerificationCallBy",
    }),
    identityVerificationCallScheduleByUser: one(users, {
      fields: [settlementProgress.identityVerificationCallScheduleBy],
      references: [users.id],
      relationName: "identityVerificationCallScheduleBy",
    }),
    identityVerificationStatusByUser: one(users, {
      fields: [settlementProgress.identityVerificationStatusBy],
      references: [users.id],
      relationName: "identityVerificationStatusBy",
    }),
    // 手出し関係
    sellerFundingStatusByUser: one(users, {
      fields: [settlementProgress.sellerFundingStatusBy],
      references: [users.id],
      relationName: "sellerFundingStatusBy",
    }),
    // 賃管関係
    subleaseSuccessionByUser: one(users, {
      fields: [settlementProgress.subleaseSuccessionBy],
      references: [users.id],
      relationName: "subleaseSuccessionBy",
    }),
    rentalContractAndKeyByUser: one(users, {
      fields: [settlementProgress.rentalContractAndKeyBy],
      references: [users.id],
      relationName: "rentalContractAndKeyBy",
    }),
    guaranteeCompanySuccessionByUser: one(users, {
      fields: [settlementProgress.guaranteeCompanySuccessionBy],
      references: [users.id],
      relationName: "guaranteeCompanySuccessionBy",
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
