import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  properties,
  propertyStaff,
  contractProgress,
  documentProgress,
  settlementProgress,
} from "../schemas/property";
import z from "zod";
import { abSettlementStatus } from "../types/property";
import { validateProgressStatusWithSettlementDate } from "@workspace/utils";

// ==================== 案件テーブル ====================

export const propertyInsertSchema = createInsertSchema(properties, {
  propertyName: z
    .string()
    .trim()
    .min(1, "物件名は必須です")
    .max(100, "物件名は100文字以内で入力してください"),
  roomNumber: z
    .string()
    .trim()
    .max(20, "号室は20文字以内で入力してください")
    .nullable()
    .optional(),
  ownerName: z
    .string()
    .trim()
    .min(1, "オーナー名は必須です")
    .max(100, "オーナー名は100文字以内で入力してください"),
  amountA: z
    .number()
    .nonnegative("A金額は0以上で入力してください")
    .nullable()
    .optional(),
  amountExit: z
    .number()
    .nonnegative("出口金額は0以上で入力してください")
    .nullable()
    .optional(),
  commission: z
    .number()
    .nonnegative("仲手等は0以上で入力してください")
    .nullable()
    .optional(),
  bcDeposit: z
    .number()
    .nonnegative("BC手付は0以上で入力してください")
    .nullable()
    .optional(),
  buyerCompany: z
    .string()
    .trim()
    .max(100, "買取業者は100文字以内で入力してください")
    .nullable()
    .optional(),
  mortgageBank: z
    .string()
    .trim()
    .max(100, "抵当銀行は100文字以内で入力してください")
    .nullable()
    .optional(),
  listType: z
    .string()
    .trim()
    .max(50, "名簿種別は50文字以内で入力してください")
    .nullable()
    .optional(),
  notes: z
    .string()
    .trim()
    .max(1000, "備考は1000文字以内で入力してください")
    .nullable()
    .optional(),
});

export const propertySelectSchema = createSelectSchema(properties);

// ==================== 案件担当者中間テーブル ====================

export const propertyStaffInsertSchema = createInsertSchema(propertyStaff);
export const propertyStaffSelectSchema = createSelectSchema(propertyStaff);

// ==================== 契約進捗テーブル ====================

export const contractProgressInsertSchema =
  createInsertSchema(contractProgress);
export const contractProgressSelectSchema =
  createSelectSchema(contractProgress);

// ==================== 書類進捗テーブル ====================

export const documentProgressInsertSchema =
  createInsertSchema(documentProgress);
export const documentProgressSelectSchema =
  createSelectSchema(documentProgress);

// ==================== 決済進捗テーブル ====================

export const settlementProgressInsertSchema =
  createInsertSchema(settlementProgress);
export const settlementProgressSelectSchema =
  createSelectSchema(settlementProgress);

// ==================== 複合スキーマ ====================

/**
 * 案件作成用のベーススキーマ
 * 案件本体 + 担当者配列を含む
 */
const propertyCreateBaseSchema = z.object({
  // 案件基本情報
  propertyName: z
    .string()
    .trim()
    .min(1, "物件名は必須です")
    .max(100, "物件名は100文字以内で入力してください"),
  roomNumber: z
    .string()
    .trim()
    .max(20, "号室は20文字以内で入力してください")
    .optional(),
  ownerName: z
    .string()
    .trim()
    .max(100, "オーナー名は100文字以内で入力してください")
    .optional(),

  // 金額情報
  amountA: z
    .number()
    .nonnegative("A金額は0以上で入力してください")
    .nullable()
    .optional(),
  amountExit: z
    .number()
    .nonnegative("出口金額は0以上で入力してください")
    .nullable()
    .optional(),
  commission: z
    .number()
    .nonnegative("仲手等は0以上で入力してください")
    .nullable()
    .optional(),
  profit: z.number().nullable().optional(), // 利益（違約の場合は手動入力）
  bcDeposit: z
    .number()
    .nonnegative("BC手付は0以上で入力してください")
    .nullable()
    .optional(),

  // 日付情報
  contractDateA: z.string().optional(),
  contractDateBc: z.string().optional(),
  settlementDate: z.string().optional(),

  // 契約情報
  contractType: z.string().optional(),
  companyB: z.string().optional(),
  brokerCompany: z.string().optional(),
  buyerCompany: z
    .string()
    .trim()
    .max(100, "買取業者は100文字以内で入力してください")
    .optional(),
  mortgageBank: z
    .string()
    .trim()
    .max(100, "抵当銀行は100文字以内で入力してください")
    .optional(),

  // その他
  listType: z
    .string()
    .trim()
    .max(50, "名簿種別は50文字以内で入力してください")
    .optional(),
  notes: z
    .string()
    .trim()
    .max(1000, "備考は1000文字以内で入力してください")
    .optional(),

  // 進捗ステータス
  progressStatus: z.string().optional(),
  documentStatus: z.string().optional(),

  // 口座情報
  accountCompany: z.string().optional(),
  bankAccount: z.string().optional(),

  // 組織ID（必須）
  organizationId: z.string().min(1, "組織は必須です"),

  // 担当者（必須、最低1名）
  staffIds: z.array(z.string()).min(1, "担当者は最低1名選択してください"),

  // 契約進捗 マイソク配布
  maisokuDistribution: z.string().optional(),

  // 契約進捗 AB関係
  abContractSaved: z.boolean().optional(),
  abAuthorizationSaved: z.boolean().optional(),
  abSellerIdSaved: z.boolean().optional(),

  // 契約進捗 BC関係
  bcContractCreated: z.boolean().optional(),
  bcDescriptionCreated: z.boolean().optional(),
  bcContractSent: z.boolean().optional(),
  bcDescriptionSent: z.boolean().optional(),
  bcContractCbDone: z.boolean().optional(),
  bcDescriptionCbDone: z.boolean().optional(),

  // 書類項目（銀行関係）
  documentItem_loan_calculation: z.string().optional(),

  // 書類項目（賃貸管理関係）
  documentItem_rental_contract: z.string().optional(),
  documentItem_management_contract: z.string().optional(),
  documentItem_move_in_application: z.string().optional(),

  // 書類項目（建物管理関係）
  documentItem_important_matters_report: z.string().optional(),
  documentItem_management_rules: z.string().optional(),
  documentItem_long_term_repair_plan: z.string().optional(),
  documentItem_general_meeting_minutes: z.string().optional(),
  documentItem_pamphlet: z.string().optional(),
  documentItem_bank_transfer_form: z.string().optional(),
  documentItem_owner_change_notification: z.string().optional(),

  // 書類項目（役所関係）
  documentItem_tax_certificate: z.string().optional(),
  documentItem_building_plan_overview: z.string().optional(),
  documentItem_ledger_certificate: z.string().optional(),
  documentItem_zoning_district: z.string().optional(),
  documentItem_road_ledger: z.string().optional(),

  // 決済進捗 精算書関係
  bcSettlementStatus: z.string().optional(),
  abSettlementStatus: z.enum(abSettlementStatus).optional(),

  // 決済進捗 司法書士関係
  lawyerRequested: z.boolean().optional(),
  documentsShared: z.boolean().optional(),
  // 権利証、住所変更、氏名変更
  propertyTitle: z.string().optional(),
  addressChange: z.string().optional(),
  nameChange: z.string().optional(),
  // 新規項目: 本人確認方法
  identityVerificationMethod: z.string().nullable().optional(),
  // 新規項目: 本人確認電話
  identityVerificationCall: z.string().optional(),
  // 新規項目: 本人確認電話日時
  identityVerificationCallSchedule: z.string().optional(),
  // 新規項目: 本人確認ステータス
  identityVerificationStatus: z.string().optional(),

  // 決済進捗 銀行関係
  // 新規項目: 抵当権抹消
  mortgageCancellation: z.string().optional(),
  loanCalculationSaved: z.boolean().optional(),

  // 決済進捗 手出し関係
  // 新規項目: 手出し状況
  sellerFundingStatus: z.string().optional(),

  // 決済進捗 賃貸管理関係
  managementCancelScheduledMonth: z.string().optional(),
  managementCancelRequestedDate: z.string().optional(),
  managementCancelCompletedDate: z.string().optional(),
  // 新規項目: サブリース承継
  subleaseSuccession: z.string().optional(),
  // 新規項目: 賃契原本＆鍵
  rentalContractAndKey: z.string().optional(),
  // 新規項目: 保証会社承継
  guaranteeCompanySuccession: z.string().optional(),
});

/**
 * 案件作成用の複合スキーマ（バリデーション付き）
 */
export const propertyCreateSchema = propertyCreateBaseSchema.superRefine(
  (data, ctx) => {
    const error = validateProgressStatusWithSettlementDate(
      data.progressStatus,
      data.settlementDate
    );
    if (error) {
      ctx.addIssue({
        code: "custom",
        message: error,
        path: ["progressStatus"],
      });
    }
  }
);

/**
 * 案件更新用の複合スキーマ
 * 案件IDを含む
 */
export const propertyUpdateSchema = propertyCreateBaseSchema
  .extend({
    id: z.string().min(1, "案件IDは必須です"),
  })
  .superRefine((data, ctx) => {
    const error = validateProgressStatusWithSettlementDate(
      data.progressStatus,
      data.settlementDate
    );
    if (error) {
      ctx.addIssue({
        code: "custom",
        message: error,
        path: ["progressStatus"],
      });
    }
  });

export type PropertyCreate = z.infer<typeof propertyCreateSchema>;
export type PropertyUpdate = z.infer<typeof propertyUpdateSchema>;
