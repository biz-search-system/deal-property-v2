"use server";

import { db } from "@workspace/drizzle/db";
import {
  contractProgress,
  documentProgress,
  properties,
  propertyDocumentItems,
  propertyStaff,
  settlementProgress,
} from "@workspace/drizzle/schemas";
import type {
  DocumentItemStatus,
  DocumentItemType,
  InsertProperty,
} from "@workspace/drizzle/types";
import {
  propertyCreateSchema,
  propertyUpdateSchema,
  type PropertyCreate,
  type PropertyUpdate,
} from "@workspace/drizzle/zod-schemas";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  validateProgressStatusWithSettlementDate,
  toJstDateKey,
} from "@workspace/utils";
import { verifySession } from "../data/sesstion";
import type { ActionResult } from "../types/action";

/** 万円から円に変換（フォーム → DB） */
function manyenToYen(manyen: number | null | undefined): number | undefined {
  if (manyen == null) return undefined;
  return manyen * 10000;
}

/**
 * 案件を新規作成する
 */
export async function createProperty(
  data: PropertyCreate
): Promise<ActionResult> {
  // セッション認証
  const session = await verifySession();

  // バリデーション
  const validatedData = propertyCreateSchema.parse(data);

  // 進捗ステータスと決済日の整合性チェック
  const validationError = validateProgressStatusWithSettlementDate(
    validatedData.progressStatus,
    validatedData.settlementDate
  );
  if (validationError) {
    return { success: false, error: validationError };
  }

  // トランザクションで案件と関連データを作成
  const result = await db.transaction(async (tx) => {
    // 万円 → 円に変換
    const amountAYen = manyenToYen(validatedData.amountA);
    const amountExitYen = manyenToYen(validatedData.amountExit);
    const commissionYen = manyenToYen(validatedData.commission);
    const bcDepositYen = manyenToYen(validatedData.bcDeposit);

    // 利益を計算
    // 違約の場合は手動入力値を使用、それ以外は自動計算
    let profit: number | undefined = undefined;
    if (validatedData.contractType === "iyaku") {
      // 違約の場合は手動入力値（万円→円）
      profit = manyenToYen(validatedData.profit);
    } else {
      // 通常の場合は自動計算（出口金額 - A金額 + 仲手等）※円単位
      if (amountExitYen != null && amountAYen != null) {
        profit = amountExitYen - amountAYen;
        if (commissionYen != null) {
          profit += commissionYen;
        }
      }
    }

    // 1. 案件本体を作成
    const propertyData: InsertProperty = {
      organizationId: validatedData.organizationId,
      propertyName: validatedData.propertyName,
      roomNumber: validatedData.roomNumber || undefined,
      ownerName: validatedData.ownerName || "", //スキマー更新新する必要ある
      amountA: amountAYen,
      amountExit: amountExitYen,
      commission: commissionYen,
      profit: profit,
      bcDeposit: bcDepositYen,
      contractDateA: validatedData.contractDateA
        ? new Date(validatedData.contractDateA)
        : undefined,
      contractDateAUpdatedAt: validatedData.contractDateA
        ? new Date()
        : undefined,
      contractDateAUpdatedBy: validatedData.contractDateA
        ? session.user.id
        : undefined,
      contractDateBc: validatedData.contractDateBc
        ? new Date(validatedData.contractDateBc)
        : undefined,
      contractDateBcUpdatedAt: validatedData.contractDateBc
        ? new Date()
        : undefined,
      contractDateBcUpdatedBy: validatedData.contractDateBc
        ? session.user.id
        : undefined,
      settlementDate: validatedData.settlementDate
        ? new Date(validatedData.settlementDate)
        : undefined,
      settlementDateUpdatedAt: validatedData.settlementDate
        ? new Date()
        : undefined,
      settlementDateUpdatedBy: validatedData.settlementDate
        ? session.user.id
        : undefined,
      contractType:
        (validatedData.contractType as InsertProperty["contractType"]) ||
        undefined,
      companyB:
        (validatedData.companyB as InsertProperty["companyB"]) || undefined,
      brokerCompany:
        (validatedData.brokerCompany as InsertProperty["brokerCompany"]) ||
        undefined,
      buyerCompany: validatedData.buyerCompany || undefined,
      mortgageBank: validatedData.mortgageBank || undefined,
      listType: validatedData.listType || undefined,
      notes: validatedData.notes || undefined,
      progressStatus:
        (validatedData.progressStatus as InsertProperty["progressStatus"]) ||
        "bc_before_confirmed",
      progressStatusUpdatedAt: new Date(),
      progressStatusUpdatedBy: session.user.id,
      documentStatus:
        (validatedData.documentStatus as InsertProperty["documentStatus"]) ||
        "waiting_request",
      documentStatusUpdatedAt: new Date(),
      documentStatusUpdatedBy: session.user.id,
      accountCompany:
        (validatedData.accountCompany as InsertProperty["accountCompany"]) ||
        undefined,
      bankAccount:
        (validatedData.bankAccount as InsertProperty["bankAccount"]) ||
        undefined,
      createdBy: session.user.id,
      updatedBy: session.user.id,
    };

    const [property] = await tx
      .insert(properties)
      .values(propertyData)
      .returning();

    if (!property) {
      return null;
    }

    // 2. 担当者を登録
    if (validatedData.staffIds.length > 0) {
      await tx.insert(propertyStaff).values(
        validatedData.staffIds.map((staffId) => ({
          propertyId: property.id,
          userId: staffId,
        }))
      );
    }

    // 3. 契約進捗を初期化（フォームの値があれば設定）
    const now = new Date();
    const maisokuValue =
      validatedData.maisokuDistribution &&
      validatedData.maisokuDistribution !== "not_distributed";
    await tx.insert(contractProgress).values({
      propertyId: property.id,
      // マイソク配布
      maisokuDistribution:
        (validatedData.maisokuDistribution as
          | "not_distributed"
          | "distributed") ?? "not_distributed",
      maisokuDistributionAt: maisokuValue ? now : null,
      maisokuDistributionBy: maisokuValue ? session.user.id : null,
      // AB関係
      abContractSaved: validatedData.abContractSaved ?? false,
      abContractSavedAt: validatedData.abContractSaved ? now : null,
      abContractSavedBy: validatedData.abContractSaved ? session.user.id : null,
      abAuthorizationSaved: validatedData.abAuthorizationSaved ?? false,
      abAuthorizationSavedAt: validatedData.abAuthorizationSaved ? now : null,
      abAuthorizationSavedBy: validatedData.abAuthorizationSaved
        ? session.user.id
        : null,
      abSellerIdSaved: validatedData.abSellerIdSaved ?? false,
      abSellerIdSavedAt: validatedData.abSellerIdSaved ? now : null,
      abSellerIdSavedBy: validatedData.abSellerIdSaved ? session.user.id : null,
      // BC関係
      bcContractCreated: validatedData.bcContractCreated ?? false,
      bcContractCreatedAt: validatedData.bcContractCreated ? now : null,
      bcContractCreatedBy: validatedData.bcContractCreated
        ? session.user.id
        : null,
      bcDescriptionCreated: validatedData.bcDescriptionCreated ?? false,
      bcDescriptionCreatedAt: validatedData.bcDescriptionCreated ? now : null,
      bcDescriptionCreatedBy: validatedData.bcDescriptionCreated
        ? session.user.id
        : null,
      bcContractSent: validatedData.bcContractSent ?? false,
      bcContractSentAt: validatedData.bcContractSent ? now : null,
      bcContractSentBy: validatedData.bcContractSent ? session.user.id : null,
      bcDescriptionSent: validatedData.bcDescriptionSent ?? false,
      bcDescriptionSentAt: validatedData.bcDescriptionSent ? now : null,
      bcDescriptionSentBy: validatedData.bcDescriptionSent
        ? session.user.id
        : null,
      bcContractCbDone: validatedData.bcContractCbDone ?? false,
      bcContractCbDoneAt: validatedData.bcContractCbDone ? now : null,
      bcContractCbDoneBy: validatedData.bcContractCbDone
        ? session.user.id
        : null,
      bcDescriptionCbDone: validatedData.bcDescriptionCbDone ?? false,
      bcDescriptionCbDoneAt: validatedData.bcDescriptionCbDone ? now : null,
      bcDescriptionCbDoneBy: validatedData.bcDescriptionCbDone
        ? session.user.id
        : null,
    });

    // 4. 書類進捗を初期化
    await tx.insert(documentProgress).values({
      propertyId: property.id,
      updatedBy: session.user.id,
    });

    // 5. 決済進捗を初期化（フォームの値があれば設定）
    const bcSettlementStatusValue =
      validatedData.bcSettlementStatus ?? "not_created";
    const abSettlementStatusValue =
      validatedData.abSettlementStatus ?? "not_created";
    const lawyerRequestedValue = validatedData.lawyerRequested ?? false;
    const documentsSharedValue = validatedData.documentsShared ?? false;
    const propertyTitleValue = validatedData.propertyTitle ?? false;
    const addressChangeValue = validatedData.addressChange ?? false;
    const nameChangeValue = validatedData.nameChange ?? false;
    const loanCalculationSavedValue =
      validatedData.loanCalculationSaved ?? false;

    await tx.insert(settlementProgress).values({
      propertyId: property.id,
      // 精算書関係 - BC精算書
      bcSettlementStatus: bcSettlementStatusValue as
        | "not_created"
        | "created"
        | "sent"
        | "cb_done",
      bcSettlementStatusAt:
        bcSettlementStatusValue !== "not_created" ? now : null,
      bcSettlementStatusBy:
        bcSettlementStatusValue !== "not_created" ? session.user.id : null,
      // 精算書関係 - AB精算書
      abSettlementStatus: abSettlementStatusValue,
      abSettlementStatusAt:
        abSettlementStatusValue !== "not_created" ? now : null,
      abSettlementStatusBy:
        abSettlementStatusValue !== "not_created" ? session.user.id : null,
      // 司法書士関係
      lawyerRequested: lawyerRequestedValue,
      lawyerRequestedAt: lawyerRequestedValue ? now : null,
      lawyerRequestedBy: lawyerRequestedValue ? session.user.id : null,
      documentsShared: documentsSharedValue,
      documentsSharedAt: documentsSharedValue ? now : null,
      documentsSharedBy: documentsSharedValue ? session.user.id : null,
      // 司法書士関係 - 権利証、住所変更、氏名変更
      propertyTitle: propertyTitleValue,
      propertyTitleAt: propertyTitleValue ? now : null,
      propertyTitleBy: propertyTitleValue ? session.user.id : null,
      addressChange: addressChangeValue,
      addressChangeAt: addressChangeValue ? now : null,
      addressChangeBy: addressChangeValue ? session.user.id : null,
      nameChange: nameChangeValue,
      nameChangeAt: nameChangeValue ? now : null,
      nameChangeBy: nameChangeValue ? session.user.id : null,
      // 司法書士関係 - 本人確認
      identityVerificationMethod:
        (validatedData.identityVerificationMethod as
          | "not_confirmed"
          | "confirming"
          | "limited_mail"
          | "in_person"
          | null) ?? null,
      identityVerificationMethodAt: validatedData.identityVerificationMethod
        ? now
        : null,
      identityVerificationMethodBy: validatedData.identityVerificationMethod
        ? session.user.id
        : null,
      identityVerificationCall:
        (validatedData.identityVerificationCall as
          | "not_requested"
          | "schedule_confirming"
          | "in_progress"
          | "completed"
          | "not_required") ?? "not_requested",
      identityVerificationCallAt:
        validatedData.identityVerificationCall &&
        validatedData.identityVerificationCall !== "not_requested"
          ? now
          : null,
      identityVerificationCallBy:
        validatedData.identityVerificationCall &&
        validatedData.identityVerificationCall !== "not_requested"
          ? session.user.id
          : null,
      identityVerificationCallSchedule:
        validatedData.identityVerificationCallSchedule || null,
      identityVerificationCallScheduleAt:
        validatedData.identityVerificationCallSchedule ? now : null,
      identityVerificationCallScheduleBy:
        validatedData.identityVerificationCallSchedule ? session.user.id : null,
      identityVerificationStatus:
        (validatedData.identityVerificationStatus as
          | "not_started"
          | "document_sent"
          | "document_received"
          | "document_returned"
          | "completed"
          | "not_required") ?? "not_started",
      identityVerificationStatusAt:
        validatedData.identityVerificationStatus &&
        validatedData.identityVerificationStatus !== "not_started"
          ? now
          : null,
      identityVerificationStatusBy:
        validatedData.identityVerificationStatus &&
        validatedData.identityVerificationStatus !== "not_started"
          ? session.user.id
          : null,
      // 銀行関係 - 抵当権抹消
      mortgageCancellation:
        (validatedData.mortgageCancellation as
          | "not_requested"
          | "confirming"
          | "in_progress"
          | "completed"
          | "not_required") ?? "not_requested",
      mortgageCancellationAt:
        validatedData.mortgageCancellation &&
        validatedData.mortgageCancellation !== "not_requested"
          ? now
          : null,
      mortgageCancellationBy:
        validatedData.mortgageCancellation &&
        validatedData.mortgageCancellation !== "not_requested"
          ? session.user.id
          : null,
      // 銀行関係 - ローン計算書保存
      loanCalculationSaved: loanCalculationSavedValue,
      loanCalculationSavedAt: loanCalculationSavedValue ? now : null,
      loanCalculationSavedBy: loanCalculationSavedValue
        ? session.user.id
        : null,
      // 手出し関係
      sellerFundingStatus:
        (validatedData.sellerFundingStatus as
          | "not_required"
          | "preliminary_review"
          | "final_review"
          | "review_completed"
          | "funds_ready") ?? "not_required",
      sellerFundingStatusAt:
        validatedData.sellerFundingStatus &&
        validatedData.sellerFundingStatus !== "not_required"
          ? now
          : null,
      sellerFundingStatusBy:
        validatedData.sellerFundingStatus &&
        validatedData.sellerFundingStatus !== "not_required"
          ? session.user.id
          : null,
      // 賃貸管理関係
      managementCancelScheduledMonth:
        validatedData.managementCancelScheduledMonth || null,
      managementCancelScheduledMonthAt:
        validatedData.managementCancelScheduledMonth ? now : null,
      managementCancelScheduledMonthBy:
        validatedData.managementCancelScheduledMonth ? session.user.id : null,
      managementCancelRequestedDate:
        validatedData.managementCancelRequestedDate || null,
      managementCancelRequestedDateAt:
        validatedData.managementCancelRequestedDate ? now : null,
      managementCancelRequestedDateBy:
        validatedData.managementCancelRequestedDate ? session.user.id : null,
      managementCancelCompletedDate:
        validatedData.managementCancelCompletedDate || null,
      managementCancelCompletedDateAt:
        validatedData.managementCancelCompletedDate ? now : null,
      managementCancelCompletedDateBy:
        validatedData.managementCancelCompletedDate ? session.user.id : null,
      // 賃貸管理関係 - サブリース承継
      subleaseSuccession:
        (validatedData.subleaseSuccession as
          | "not_required"
          | "confirming"
          | "in_progress"
          | "completed") ?? "not_required",
      subleaseSuccessionAt:
        validatedData.subleaseSuccession &&
        validatedData.subleaseSuccession !== "not_required"
          ? now
          : null,
      subleaseSuccessionBy:
        validatedData.subleaseSuccession &&
        validatedData.subleaseSuccession !== "not_required"
          ? session.user.id
          : null,
      // 賃貸管理関係 - 賃契原本＆鍵
      rentalContractAndKey:
        (validatedData.rentalContractAndKey as
          | "not_requested"
          | "confirming"
          | "in_progress"
          | "completed"
          | "not_required") ?? "not_requested",
      rentalContractAndKeyAt:
        validatedData.rentalContractAndKey &&
        validatedData.rentalContractAndKey !== "not_requested"
          ? now
          : null,
      rentalContractAndKeyBy:
        validatedData.rentalContractAndKey &&
        validatedData.rentalContractAndKey !== "not_requested"
          ? session.user.id
          : null,
      // 賃貸管理関係 - 保証会社承継
      guaranteeCompanySuccession:
        (validatedData.guaranteeCompanySuccession as
          | "not_required"
          | "confirming"
          | "in_progress"
          | "completed") ?? "not_required",
      guaranteeCompanySuccessionAt:
        validatedData.guaranteeCompanySuccession &&
        validatedData.guaranteeCompanySuccession !== "not_required"
          ? now
          : null,
      guaranteeCompanySuccessionBy:
        validatedData.guaranteeCompanySuccession &&
        validatedData.guaranteeCompanySuccession !== "not_required"
          ? session.user.id
          : null,
    });

    return property;
  });

  if (!result) {
    return { success: false, error: "案件の作成に失敗しました" };
  }

  revalidatePath("/properties/unconfirmed");
  return { success: true };
}

/**
 * 案件を更新する
 */
export async function updateProperty(
  data: PropertyUpdate
): Promise<ActionResult> {
  // セッション認証
  const session = await verifySession();

  // バリデーション
  const validatedData = propertyUpdateSchema.parse(data);

  // 進捗ステータスと決済日の整合性チェック
  const validationError = validateProgressStatusWithSettlementDate(
    validatedData.progressStatus,
    validatedData.settlementDate
  );
  if (validationError) {
    return { success: false, error: validationError };
  }

  // トランザクションで案件と関連データを更新
  const result = await db.transaction(async (tx) => {
    // 現在の案件データを取得（日付変更検出用）
    const currentProperty = await tx.query.properties.findFirst({
      where: eq(properties.id, validatedData.id),
    });

    // 万円 → 円に変換
    const amountAYen = manyenToYen(validatedData.amountA);
    const amountExitYen = manyenToYen(validatedData.amountExit);
    const commissionYen = manyenToYen(validatedData.commission);
    const bcDepositYen = manyenToYen(validatedData.bcDeposit);

    // 利益を計算
    // 違約の場合は手動入力値を使用、それ以外は自動計算
    let profit: number | undefined = undefined;
    if (validatedData.contractType === "iyaku") {
      // 違約の場合は手動入力値（万円→円）
      profit = manyenToYen(validatedData.profit);
    } else {
      // 通常の場合は自動計算（出口金額 - A金額 + 仲手等）※円単位
      if (amountExitYen != null && amountAYen != null) {
        profit = amountExitYen - amountAYen;
        if (commissionYen != null) {
          profit += commissionYen;
        }
      }
    }

    const now = new Date();

    // 日付変更の検出（文字列比較で差分を確認）
    const currentContractDateA = currentProperty?.contractDateA?.toISOString();
    const newContractDateA = validatedData.contractDateA
      ? new Date(validatedData.contractDateA).toISOString()
      : undefined;
    const contractDateAChanged = currentContractDateA !== newContractDateA;

    const currentContractDateBc =
      currentProperty?.contractDateBc?.toISOString();
    const newContractDateBc = validatedData.contractDateBc
      ? new Date(validatedData.contractDateBc).toISOString()
      : undefined;
    const contractDateBcChanged = currentContractDateBc !== newContractDateBc;

    const currentSettlementDate =
      currentProperty?.settlementDate?.toISOString();
    const newSettlementDate = validatedData.settlementDate
      ? new Date(validatedData.settlementDate).toISOString()
      : undefined;
    const settlementDateChanged = currentSettlementDate !== newSettlementDate;

    // 進捗ステータス変更の検出
    const progressStatusChanged =
      currentProperty?.progressStatus !== validatedData.progressStatus;

    // 書類ステータス変更の検出
    const documentStatusChanged =
      currentProperty?.documentStatus !== validatedData.documentStatus;

    // 1. 案件本体を更新
    const [property] = await tx
      .update(properties)
      .set({
        organizationId: validatedData.organizationId,
        propertyName: validatedData.propertyName,
        roomNumber: validatedData.roomNumber || undefined,
        ownerName: validatedData.ownerName,
        amountA: amountAYen,
        amountExit: amountExitYen,
        commission: commissionYen,
        profit: profit,
        bcDeposit: bcDepositYen,
        contractDateA: validatedData.contractDateA
          ? new Date(validatedData.contractDateA)
          : undefined,
        contractDateAUpdatedAt: contractDateAChanged
          ? now
          : currentProperty?.contractDateAUpdatedAt,
        contractDateAUpdatedBy: contractDateAChanged
          ? session.user.id
          : currentProperty?.contractDateAUpdatedBy,
        contractDateBc: validatedData.contractDateBc
          ? new Date(validatedData.contractDateBc)
          : undefined,
        contractDateBcUpdatedAt: contractDateBcChanged
          ? now
          : currentProperty?.contractDateBcUpdatedAt,
        contractDateBcUpdatedBy: contractDateBcChanged
          ? session.user.id
          : currentProperty?.contractDateBcUpdatedBy,
        settlementDate: validatedData.settlementDate
          ? new Date(validatedData.settlementDate)
          : undefined,
        settlementDateUpdatedAt: settlementDateChanged
          ? now
          : currentProperty?.settlementDateUpdatedAt,
        settlementDateUpdatedBy: settlementDateChanged
          ? session.user.id
          : currentProperty?.settlementDateUpdatedBy,
        contractType:
          (validatedData.contractType as InsertProperty["contractType"]) ||
          undefined,
        companyB:
          (validatedData.companyB as InsertProperty["companyB"]) || undefined,
        brokerCompany:
          (validatedData.brokerCompany as InsertProperty["brokerCompany"]) ||
          undefined,
        buyerCompany: validatedData.buyerCompany || undefined,
        mortgageBank: validatedData.mortgageBank || undefined,
        listType: validatedData.listType || undefined,
        notes: validatedData.notes || undefined,
        progressStatus:
          (validatedData.progressStatus as InsertProperty["progressStatus"]) ||
          undefined,
        progressStatusUpdatedAt: progressStatusChanged
          ? now
          : currentProperty?.progressStatusUpdatedAt,
        progressStatusUpdatedBy: progressStatusChanged
          ? session.user.id
          : currentProperty?.progressStatusUpdatedBy,
        documentStatus:
          (validatedData.documentStatus as InsertProperty["documentStatus"]) ||
          undefined,
        documentStatusUpdatedAt: documentStatusChanged
          ? now
          : currentProperty?.documentStatusUpdatedAt,
        documentStatusUpdatedBy: documentStatusChanged
          ? session.user.id
          : currentProperty?.documentStatusUpdatedBy,
        accountCompany:
          (validatedData.accountCompany as InsertProperty["accountCompany"]) ||
          undefined,
        bankAccount:
          (validatedData.bankAccount as InsertProperty["bankAccount"]) ||
          undefined,
        updatedBy: session.user.id,
      })
      .where(eq(properties.id, validatedData.id))
      .returning();

    // 2. 既存の担当者を削除
    await tx
      .delete(propertyStaff)
      .where(eq(propertyStaff.propertyId, validatedData.id));

    // 3. 新しい担当者を登録
    if (validatedData.staffIds.length > 0) {
      await tx.insert(propertyStaff).values(
        validatedData.staffIds.map((staffId) => ({
          propertyId: validatedData.id,
          userId: staffId,
        }))
      );
    }

    // 4. 契約進捗 AB関係を更新
    // 現在のcontractProgressを取得して差分を確認
    const currentProgress = await tx.query.contractProgress.findFirst({
      where: eq(contractProgress.propertyId, validatedData.id),
    });

    // マイソク配布 - 状態が変更されたかどうかを判定
    const maisokuDistributionChanged =
      (validatedData.maisokuDistribution ?? "not_distributed") !==
      (currentProgress?.maisokuDistribution ?? "not_distributed");

    // AB関係 - 状態が変更されたかどうかを判定
    const abContractChanged =
      (validatedData.abContractSaved ?? false) !==
      (currentProgress?.abContractSaved ?? false);
    const abAuthorizationChanged =
      (validatedData.abAuthorizationSaved ?? false) !==
      (currentProgress?.abAuthorizationSaved ?? false);
    const abSellerIdChanged =
      (validatedData.abSellerIdSaved ?? false) !==
      (currentProgress?.abSellerIdSaved ?? false);

    // BC関係 - 状態が変更されたかどうかを判定
    const bcContractCreatedChanged =
      (validatedData.bcContractCreated ?? false) !==
      (currentProgress?.bcContractCreated ?? false);
    const bcDescriptionCreatedChanged =
      (validatedData.bcDescriptionCreated ?? false) !==
      (currentProgress?.bcDescriptionCreated ?? false);
    const bcContractSentChanged =
      (validatedData.bcContractSent ?? false) !==
      (currentProgress?.bcContractSent ?? false);
    const bcDescriptionSentChanged =
      (validatedData.bcDescriptionSent ?? false) !==
      (currentProgress?.bcDescriptionSent ?? false);
    const bcContractCbDoneChanged =
      (validatedData.bcContractCbDone ?? false) !==
      (currentProgress?.bcContractCbDone ?? false);
    const bcDescriptionCbDoneChanged =
      (validatedData.bcDescriptionCbDone ?? false) !==
      (currentProgress?.bcDescriptionCbDone ?? false);

    await tx
      .update(contractProgress)
      .set({
        // マイソク配布
        maisokuDistribution:
          (validatedData.maisokuDistribution as
            | "not_distributed"
            | "distributed") ?? "not_distributed",
        maisokuDistributionAt: maisokuDistributionChanged
          ? now
          : currentProgress?.maisokuDistributionAt,
        maisokuDistributionBy: maisokuDistributionChanged
          ? session.user.id
          : currentProgress?.maisokuDistributionBy,
        // AB関係 - 契約書保存
        abContractSaved: validatedData.abContractSaved ?? false,
        abContractSavedAt: abContractChanged
          ? now
          : currentProgress?.abContractSavedAt,
        abContractSavedBy: abContractChanged
          ? session.user.id
          : currentProgress?.abContractSavedBy,
        // AB関係 - 委任状関係保存
        abAuthorizationSaved: validatedData.abAuthorizationSaved ?? false,
        abAuthorizationSavedAt: abAuthorizationChanged
          ? now
          : currentProgress?.abAuthorizationSavedAt,
        abAuthorizationSavedBy: abAuthorizationChanged
          ? session.user.id
          : currentProgress?.abAuthorizationSavedBy,
        // AB関係 - 売主身分証保存
        abSellerIdSaved: validatedData.abSellerIdSaved ?? false,
        abSellerIdSavedAt: abSellerIdChanged
          ? now
          : currentProgress?.abSellerIdSavedAt,
        abSellerIdSavedBy: abSellerIdChanged
          ? session.user.id
          : currentProgress?.abSellerIdSavedBy,
        // BC関係 - BC売契作成
        bcContractCreated: validatedData.bcContractCreated ?? false,
        bcContractCreatedAt: bcContractCreatedChanged
          ? now
          : currentProgress?.bcContractCreatedAt,
        bcContractCreatedBy: bcContractCreatedChanged
          ? session.user.id
          : currentProgress?.bcContractCreatedBy,
        // BC関係 - 重説作成
        bcDescriptionCreated: validatedData.bcDescriptionCreated ?? false,
        bcDescriptionCreatedAt: bcDescriptionCreatedChanged
          ? now
          : currentProgress?.bcDescriptionCreatedAt,
        bcDescriptionCreatedBy: bcDescriptionCreatedChanged
          ? session.user.id
          : currentProgress?.bcDescriptionCreatedBy,
        // BC関係 - BC売契送付
        bcContractSent: validatedData.bcContractSent ?? false,
        bcContractSentAt: bcContractSentChanged
          ? now
          : currentProgress?.bcContractSentAt,
        bcContractSentBy: bcContractSentChanged
          ? session.user.id
          : currentProgress?.bcContractSentBy,
        // BC関係 - 重説送付
        bcDescriptionSent: validatedData.bcDescriptionSent ?? false,
        bcDescriptionSentAt: bcDescriptionSentChanged
          ? now
          : currentProgress?.bcDescriptionSentAt,
        bcDescriptionSentBy: bcDescriptionSentChanged
          ? session.user.id
          : currentProgress?.bcDescriptionSentBy,
        // BC関係 - BC売契CB完了
        bcContractCbDone: validatedData.bcContractCbDone ?? false,
        bcContractCbDoneAt: bcContractCbDoneChanged
          ? now
          : currentProgress?.bcContractCbDoneAt,
        bcContractCbDoneBy: bcContractCbDoneChanged
          ? session.user.id
          : currentProgress?.bcContractCbDoneBy,
        // BC関係 - 重説CB完了
        bcDescriptionCbDone: validatedData.bcDescriptionCbDone ?? false,
        bcDescriptionCbDoneAt: bcDescriptionCbDoneChanged
          ? now
          : currentProgress?.bcDescriptionCbDoneAt,
        bcDescriptionCbDoneBy: bcDescriptionCbDoneChanged
          ? session.user.id
          : currentProgress?.bcDescriptionCbDoneBy,
        updatedAt: now,
      })
      .where(eq(contractProgress.propertyId, validatedData.id));

    // 5. 決済進捗を更新
    const currentSettlement = await tx.query.settlementProgress.findFirst({
      where: eq(settlementProgress.propertyId, validatedData.id),
    });

    // 精算書関係 - ステータス変更の検出
    const bcSettlementStatusChanged =
      (validatedData.bcSettlementStatus ?? "not_created") !==
      (currentSettlement?.bcSettlementStatus ?? "not_created");
    const abSettlementStatusChanged =
      (validatedData.abSettlementStatus ?? "not_created") !==
      (currentSettlement?.abSettlementStatus ?? "not_created");

    // 司法書士関係 - 状態が変更されたかどうかを判定
    const lawyerRequestedChanged =
      (validatedData.lawyerRequested ?? false) !==
      (currentSettlement?.lawyerRequested ?? false);
    const documentsSharedChanged =
      (validatedData.documentsShared ?? false) !==
      (currentSettlement?.documentsShared ?? false);
    const propertyTitleChanged =
      (validatedData.propertyTitle ?? false) !==
      (currentSettlement?.propertyTitle ?? false);
    const addressChangeChanged =
      (validatedData.addressChange ?? false) !==
      (currentSettlement?.addressChange ?? false);
    const nameChangeChanged =
      (validatedData.nameChange ?? false) !==
      (currentSettlement?.nameChange ?? false);
    const identityVerificationMethodChanged =
      (validatedData.identityVerificationMethod ?? null) !==
      (currentSettlement?.identityVerificationMethod ?? null);
    const identityVerificationCallChanged =
      (validatedData.identityVerificationCall ?? "not_requested") !==
      (currentSettlement?.identityVerificationCall ?? "not_requested");
    const identityVerificationCallScheduleChanged =
      (validatedData.identityVerificationCallSchedule || null) !==
      (currentSettlement?.identityVerificationCallSchedule || null);
    const identityVerificationStatusChanged =
      (validatedData.identityVerificationStatus ?? "not_started") !==
      (currentSettlement?.identityVerificationStatus ?? "not_started");

    // 銀行関係 - 状態が変更されたかどうかを判定
    const mortgageCancellationChanged =
      (validatedData.mortgageCancellation ?? "not_requested") !==
      (currentSettlement?.mortgageCancellation ?? "not_requested");
    const loanCalculationSavedChanged =
      (validatedData.loanCalculationSaved ?? false) !==
      (currentSettlement?.loanCalculationSaved ?? false);

    // 手出し関係 - 状態が変更されたかどうかを判定
    const sellerFundingStatusChanged =
      (validatedData.sellerFundingStatus ?? "not_required") !==
      (currentSettlement?.sellerFundingStatus ?? "not_required");

    // 賃貸管理関係 - 状態が変更されたかどうかを判定
    const managementCancelScheduledMonthChanged =
      (validatedData.managementCancelScheduledMonth || null) !==
      (currentSettlement?.managementCancelScheduledMonth || null);
    const managementCancelRequestedDateChanged =
      (validatedData.managementCancelRequestedDate || null) !==
      (currentSettlement?.managementCancelRequestedDate || null);
    const managementCancelCompletedDateChanged =
      (validatedData.managementCancelCompletedDate || null) !==
      (currentSettlement?.managementCancelCompletedDate || null);
    const subleaseSuccessionChanged =
      (validatedData.subleaseSuccession ?? "not_required") !==
      (currentSettlement?.subleaseSuccession ?? "not_required");
    const rentalContractAndKeyChanged =
      (validatedData.rentalContractAndKey ?? "not_requested") !==
      (currentSettlement?.rentalContractAndKey ?? "not_requested");
    const guaranteeCompanySuccessionChanged =
      (validatedData.guaranteeCompanySuccession ?? "not_required") !==
      (currentSettlement?.guaranteeCompanySuccession ?? "not_required");

    await tx
      .update(settlementProgress)
      .set({
        // 精算書関係 - BC精算書
        bcSettlementStatus:
          (validatedData.bcSettlementStatus as
            | "not_created"
            | "created"
            | "sent"
            | "cb_done") ?? "not_created",
        bcSettlementStatusAt: bcSettlementStatusChanged
          ? now
          : currentSettlement?.bcSettlementStatusAt,
        bcSettlementStatusBy: bcSettlementStatusChanged
          ? session.user.id
          : currentSettlement?.bcSettlementStatusBy,
        // 精算書関係 - AB精算書
        abSettlementStatus:
          (validatedData.abSettlementStatus as
            | "not_created"
            | "created"
            | "sent"
            | "cr_done") ?? "not_created",
        abSettlementStatusAt: abSettlementStatusChanged
          ? now
          : currentSettlement?.abSettlementStatusAt,
        abSettlementStatusBy: abSettlementStatusChanged
          ? session.user.id
          : currentSettlement?.abSettlementStatusBy,
        // 司法書士関係 - 司法書士依頼
        lawyerRequested: validatedData.lawyerRequested ?? false,
        lawyerRequestedAt: lawyerRequestedChanged
          ? now
          : currentSettlement?.lawyerRequestedAt,
        lawyerRequestedBy: lawyerRequestedChanged
          ? session.user.id
          : currentSettlement?.lawyerRequestedBy,
        // 司法書士関係 - 必要書類共有
        documentsShared: validatedData.documentsShared ?? false,
        documentsSharedAt: documentsSharedChanged
          ? now
          : currentSettlement?.documentsSharedAt,
        documentsSharedBy: documentsSharedChanged
          ? session.user.id
          : currentSettlement?.documentsSharedBy,
        // 司法書士関係 - 権利証
        propertyTitle: validatedData.propertyTitle ?? false,
        propertyTitleAt: propertyTitleChanged
          ? now
          : currentSettlement?.propertyTitleAt,
        propertyTitleBy: propertyTitleChanged
          ? session.user.id
          : currentSettlement?.propertyTitleBy,
        // 司法書士関係 - 住所変更
        addressChange: validatedData.addressChange ?? false,
        addressChangeAt: addressChangeChanged
          ? now
          : currentSettlement?.addressChangeAt,
        addressChangeBy: addressChangeChanged
          ? session.user.id
          : currentSettlement?.addressChangeBy,
        // 司法書士関係 - 氏名変更
        nameChange: validatedData.nameChange ?? false,
        nameChangeAt: nameChangeChanged
          ? now
          : currentSettlement?.nameChangeAt,
        nameChangeBy: nameChangeChanged
          ? session.user.id
          : currentSettlement?.nameChangeBy,
        // 司法書士関係 - 本人確認方法
        identityVerificationMethod:
          (validatedData.identityVerificationMethod as
            | "not_confirmed"
            | "confirming"
            | "limited_mail"
            | "in_person"
            | null) ?? null,
        identityVerificationMethodAt: identityVerificationMethodChanged
          ? now
          : currentSettlement?.identityVerificationMethodAt,
        identityVerificationMethodBy: identityVerificationMethodChanged
          ? session.user.id
          : currentSettlement?.identityVerificationMethodBy,
        // 司法書士関係 - 本人確認電話
        identityVerificationCall:
          (validatedData.identityVerificationCall as
            | "not_requested"
            | "schedule_confirming"
            | "in_progress"
            | "completed"
            | "not_required") ?? "not_requested",
        identityVerificationCallAt: identityVerificationCallChanged
          ? now
          : currentSettlement?.identityVerificationCallAt,
        identityVerificationCallBy: identityVerificationCallChanged
          ? session.user.id
          : currentSettlement?.identityVerificationCallBy,
        // 司法書士関係 - 本人確認電話日時
        identityVerificationCallSchedule:
          validatedData.identityVerificationCallSchedule || null,
        identityVerificationCallScheduleAt:
          identityVerificationCallScheduleChanged
            ? now
            : currentSettlement?.identityVerificationCallScheduleAt,
        identityVerificationCallScheduleBy:
          identityVerificationCallScheduleChanged
            ? session.user.id
            : currentSettlement?.identityVerificationCallScheduleBy,
        // 司法書士関係 - 本人確認ステータス
        identityVerificationStatus:
          (validatedData.identityVerificationStatus as
            | "not_started"
            | "document_sent"
            | "document_received"
            | "document_returned"
            | "completed"
            | "not_required") ?? "not_started",
        identityVerificationStatusAt: identityVerificationStatusChanged
          ? now
          : currentSettlement?.identityVerificationStatusAt,
        identityVerificationStatusBy: identityVerificationStatusChanged
          ? session.user.id
          : currentSettlement?.identityVerificationStatusBy,
        // 銀行関係 - 抵当権抹消
        mortgageCancellation:
          (validatedData.mortgageCancellation as
            | "not_requested"
            | "confirming"
            | "in_progress"
            | "completed"
            | "not_required") ?? "not_requested",
        mortgageCancellationAt: mortgageCancellationChanged
          ? now
          : currentSettlement?.mortgageCancellationAt,
        mortgageCancellationBy: mortgageCancellationChanged
          ? session.user.id
          : currentSettlement?.mortgageCancellationBy,
        // 銀行関係 - ローン計算書保存
        loanCalculationSaved: validatedData.loanCalculationSaved ?? false,
        loanCalculationSavedAt: loanCalculationSavedChanged
          ? now
          : currentSettlement?.loanCalculationSavedAt,
        loanCalculationSavedBy: loanCalculationSavedChanged
          ? session.user.id
          : currentSettlement?.loanCalculationSavedBy,
        // 手出し関係 - 手出し状況
        sellerFundingStatus:
          (validatedData.sellerFundingStatus as
            | "not_required"
            | "preliminary_review"
            | "final_review"
            | "review_completed"
            | "funds_ready") ?? "not_required",
        sellerFundingStatusAt: sellerFundingStatusChanged
          ? now
          : currentSettlement?.sellerFundingStatusAt,
        sellerFundingStatusBy: sellerFundingStatusChanged
          ? session.user.id
          : currentSettlement?.sellerFundingStatusBy,
        // 賃貸管理関係 - 管理解約予定月
        managementCancelScheduledMonth:
          validatedData.managementCancelScheduledMonth || null,
        managementCancelScheduledMonthAt: managementCancelScheduledMonthChanged
          ? now
          : currentSettlement?.managementCancelScheduledMonthAt,
        managementCancelScheduledMonthBy: managementCancelScheduledMonthChanged
          ? session.user.id
          : currentSettlement?.managementCancelScheduledMonthBy,
        // 賃貸管理関係 - 管理解約依頼日
        managementCancelRequestedDate:
          validatedData.managementCancelRequestedDate || null,
        managementCancelRequestedDateAt: managementCancelRequestedDateChanged
          ? now
          : currentSettlement?.managementCancelRequestedDateAt,
        managementCancelRequestedDateBy: managementCancelRequestedDateChanged
          ? session.user.id
          : currentSettlement?.managementCancelRequestedDateBy,
        // 賃貸管理関係 - 管理解約完了日
        managementCancelCompletedDate:
          validatedData.managementCancelCompletedDate || null,
        managementCancelCompletedDateAt: managementCancelCompletedDateChanged
          ? now
          : currentSettlement?.managementCancelCompletedDateAt,
        managementCancelCompletedDateBy: managementCancelCompletedDateChanged
          ? session.user.id
          : currentSettlement?.managementCancelCompletedDateBy,
        // 賃貸管理関係 - サブリース承継
        subleaseSuccession:
          (validatedData.subleaseSuccession as
            | "not_required"
            | "confirming"
            | "in_progress"
            | "completed") ?? "not_required",
        subleaseSuccessionAt: subleaseSuccessionChanged
          ? now
          : currentSettlement?.subleaseSuccessionAt,
        subleaseSuccessionBy: subleaseSuccessionChanged
          ? session.user.id
          : currentSettlement?.subleaseSuccessionBy,
        // 賃貸管理関係 - 賃契原本＆鍵
        rentalContractAndKey:
          (validatedData.rentalContractAndKey as
            | "not_requested"
            | "confirming"
            | "in_progress"
            | "completed"
            | "not_required") ?? "not_requested",
        rentalContractAndKeyAt: rentalContractAndKeyChanged
          ? now
          : currentSettlement?.rentalContractAndKeyAt,
        rentalContractAndKeyBy: rentalContractAndKeyChanged
          ? session.user.id
          : currentSettlement?.rentalContractAndKeyBy,
        // 賃貸管理関係 - 保証会社承継
        guaranteeCompanySuccession:
          (validatedData.guaranteeCompanySuccession as
            | "not_required"
            | "confirming"
            | "in_progress"
            | "completed") ?? "not_required",
        guaranteeCompanySuccessionAt: guaranteeCompanySuccessionChanged
          ? now
          : currentSettlement?.guaranteeCompanySuccessionAt,
        guaranteeCompanySuccessionBy: guaranteeCompanySuccessionChanged
          ? session.user.id
          : currentSettlement?.guaranteeCompanySuccessionBy,
      })
      .where(eq(settlementProgress.propertyId, validatedData.id));

    // 6. 書類項目を更新（UPSERT）
    const documentItemTypes = [
      "loan_calculation",
      "rental_contract",
      "management_contract",
      "move_in_application",
      "important_matters_report",
      "management_rules",
      "long_term_repair_plan",
      "general_meeting_minutes",
      "pamphlet",
      "bank_transfer_form",
      "owner_change_notification",
      "tax_certificate",
      "building_plan_overview",
      "ledger_certificate",
      "zoning_district",
      "road_ledger",
    ] as const;

    // 現在の書類項目を取得
    const currentDocumentItems = await tx.query.propertyDocumentItems.findMany({
      where: eq(propertyDocumentItems.propertyId, validatedData.id),
    });

    for (const itemType of documentItemTypes) {
      const fieldName =
        `documentItem_${itemType}` as keyof typeof validatedData;
      const newStatus = validatedData[fieldName] as string | undefined;

      if (!newStatus) continue;

      const existingItem = currentDocumentItems.find(
        (item) => item.itemType === itemType
      );

      if (existingItem) {
        // 値が変更された場合のみ更新
        if (existingItem.status !== newStatus) {
          await tx
            .update(propertyDocumentItems)
            .set({
              status: newStatus as DocumentItemStatus,
              updatedAt: now,
              updatedBy: session.user.id,
            })
            .where(eq(propertyDocumentItems.id, existingItem.id));
        }
      } else {
        // 新規作成（デフォルト以外の値の場合のみ）
        if (newStatus !== "not_requested") {
          await tx.insert(propertyDocumentItems).values({
            propertyId: validatedData.id,
            itemType: itemType as DocumentItemType,
            status: newStatus as DocumentItemStatus,
            updatedAt: now,
            updatedBy: session.user.id,
          });
        }
      }
    }

    return property;
  });

  revalidatePath("/properties");

  return { success: true };
}

/**
 * 案件を削除する
 */
export async function deleteProperty(id: string) {
  // セッション認証
  const session = await verifySession();

  // トランザクションで案件と関連データを削除
  await db.transaction(async (tx) => {
    // 1. 担当者を削除
    await tx.delete(propertyStaff).where(eq(propertyStaff.propertyId, id));

    // 2. 契約進捗を削除
    await tx
      .delete(contractProgress)
      .where(eq(contractProgress.propertyId, id));

    // 3. 書類進捗を削除
    await tx
      .delete(documentProgress)
      .where(eq(documentProgress.propertyId, id));

    // 4. 決済進捗を削除
    await tx
      .delete(settlementProgress)
      .where(eq(settlementProgress.propertyId, id));

    // 5. 案件本体を削除
    await tx.delete(properties).where(eq(properties.id, id));
  });

  revalidatePath("/properties");
}

/**
 * 案件の進捗ステータスを更新（インライン編集用）
 */
export async function updatePropertyProgressStatus(data: {
  id: string;
  progressStatus: string;
}): Promise<ActionResult> {
  // セッション認証
  const session = await verifySession();

  // 決済日を取得してバリデーション
  const property = await db.query.properties.findFirst({
    where: eq(properties.id, data.id),
    columns: { settlementDate: true },
  });

  // 進捗ステータスと決済日の整合性チェック
  const validationError = validateProgressStatusWithSettlementDate(
    data.progressStatus,
    property?.settlementDate ?? undefined
  );

  if (validationError) {
    return { success: false, error: validationError };
  }

  await db
    .update(properties)
    .set({
      progressStatus: data.progressStatus as InsertProperty["progressStatus"],
      updatedBy: session.user.id,
      updatedAt: new Date(),
    })
    .where(eq(properties.id, data.id));

  revalidatePath("/properties");
  revalidatePath("/properties/unconfirmed");

  return { success: true };
}

/**
 * 案件の書類ステータスを更新（インライン編集用）
 */
export async function updatePropertyDocumentStatus(data: {
  id: string;
  documentStatus: string;
}): Promise<ActionResult> {
  // セッション認証
  const session = await verifySession();

  const now = new Date();

  await db
    .update(properties)
    .set({
      documentStatus: data.documentStatus as InsertProperty["documentStatus"],
      documentStatusUpdatedAt: now,
      documentStatusUpdatedBy: session.user.id,
      updatedBy: session.user.id,
      updatedAt: now,
    })
    .where(eq(properties.id, data.id));

  revalidatePath("/properties");
  revalidatePath("/properties/unconfirmed");

  return { success: true };
}

/**
 * 案件の備考を更新（インライン編集用）
 */
export async function updatePropertyNotes(data: { id: string; notes: string }) {
  // セッション認証
  const session = await verifySession();

  await db
    .update(properties)
    .set({
      notes: data.notes,
      updatedBy: session.user.id,
      updatedAt: new Date(),
    })
    .where(eq(properties.id, data.id));

  revalidatePath("/properties");
  revalidatePath("/properties/unconfirmed");
}

/**
 * 案件の決済日を更新（インライン編集用）
 */
export async function updatePropertySettlementDate(data: {
  id: string;
  settlementDate: Date | null;
}) {
  // セッション認証
  const session = await verifySession();

  const now = new Date();

  await db
    .update(properties)
    .set({
      settlementDate: data.settlementDate,
      settlementDateUpdatedAt: now,
      settlementDateUpdatedBy: session.user.id,
      updatedBy: session.user.id,
      updatedAt: now,
    })
    .where(eq(properties.id, data.id));

  revalidatePath("/properties");
  revalidatePath("/properties/unconfirmed");
  revalidatePath("/properties/search");
  // 月次ビューも更新（JST基準で年月を計算）
  if (data.settlementDate) {
    const jstDateKey = toJstDateKey(data.settlementDate);
    const [year, month] = jstDateKey.split("-");
    revalidatePath(`/properties/monthly/${year}/${month}`);
  }
}

/**
 * 案件の物件名を更新（インライン編集用）
 */
export async function updatePropertyName(data: {
  id: string;
  propertyName: string;
}) {
  // セッション認証
  const session = await verifySession();

  if (!data.propertyName.trim()) {
    throw new Error("物件名は必須です");
  }

  await db
    .update(properties)
    .set({
      propertyName: data.propertyName.trim(),
      updatedBy: session.user.id,
      updatedAt: new Date(),
    })
    .where(eq(properties.id, data.id));

  revalidatePath("/properties");
  revalidatePath("/properties/unconfirmed");
  revalidatePath("/properties/search");
}

/**
 * 案件のオーナー名を更新（インライン編集用）
 */
export async function updatePropertyOwnerName(data: {
  id: string;
  ownerName: string;
}) {
  // セッション認証
  const session = await verifySession();

  await db
    .update(properties)
    .set({
      ownerName: data.ownerName.trim(),
      updatedBy: session.user.id,
      updatedAt: new Date(),
    })
    .where(eq(properties.id, data.id));

  revalidatePath("/properties");
  revalidatePath("/properties/unconfirmed");
}

/**
 * 案件の金額フィールドを更新（インライン編集用）
 * amountA: A金額
 * amountExit: 出口金額
 * commission: 仲手等
 * bcDeposit: BC手付
 */
export async function updatePropertyAmount(data: {
  id: string;
  field: "amountA" | "amountExit" | "commission" | "bcDeposit";
  value: number | null;
}) {
  // セッション認証
  const session = await verifySession();

  // 現在の案件データを取得して利益を再計算
  const currentProperty = await db.query.properties.findFirst({
    where: eq(properties.id, data.id),
  });

  if (!currentProperty) {
    throw new Error("案件が見つかりません");
  }

  // 更新後の値を計算
  const updatedValues = {
    amountA: data.field === "amountA" ? data.value : currentProperty.amountA,
    amountExit:
      data.field === "amountExit" ? data.value : currentProperty.amountExit,
    commission:
      data.field === "commission" ? data.value : currentProperty.commission,
    bcDeposit:
      data.field === "bcDeposit" ? data.value : currentProperty.bcDeposit,
  };

  // 利益を再計算（出口金額 - A金額 + 仲手等）
  let profit: number | null = null;
  if (updatedValues.amountExit !== null && updatedValues.amountA !== null) {
    profit = updatedValues.amountExit - updatedValues.amountA;
    if (updatedValues.commission !== null) {
      profit += updatedValues.commission;
    }
  }

  await db
    .update(properties)
    .set({
      [data.field]: data.value,
      profit,
      updatedBy: session.user.id,
      updatedAt: new Date(),
    })
    .where(eq(properties.id, data.id));

  revalidatePath("/properties");
  revalidatePath("/properties/unconfirmed");
}

/**
 * 案件のEnum型フィールドを更新（インライン編集用）
 * contractType: 契約形態
 * companyB: B会社
 * brokerCompany: 仲介会社
 */
export async function updatePropertyEnumField(data: {
  id: string;
  field: "contractType" | "companyB" | "brokerCompany";
  value: string | null;
}): Promise<ActionResult> {
  // セッション認証
  const session = await verifySession();

  await db
    .update(properties)
    .set({
      [data.field]: data.value,
      updatedBy: session.user.id,
      updatedAt: new Date(),
    })
    .where(eq(properties.id, data.id));

  revalidatePath("/properties");
  revalidatePath("/properties/unconfirmed");

  return { success: true };
}

/**
 * 案件の買取会社を更新（インライン編集用）
 */
export async function updatePropertyBuyerCompany(data: {
  id: string;
  buyerCompany: string | null;
}) {
  // セッション認証
  const session = await verifySession();

  await db
    .update(properties)
    .set({
      buyerCompany: data.buyerCompany?.trim() || null,
      updatedBy: session.user.id,
      updatedAt: new Date(),
    })
    .where(eq(properties.id, data.id));

  revalidatePath("/properties");
  revalidatePath("/properties/unconfirmed");
}

/**
 * 案件の書類項目ステータスを更新
 * @param data.propertyId 案件ID
 * @param data.itemType 書類項目種別
 * @param data.status 更新後のステータス
 */
export async function updatePropertyDocumentItem(data: {
  propertyId: string;
  itemType: DocumentItemType;
  status: DocumentItemStatus;
}) {
  const session = await verifySession();
  const now = new Date();

  // UPSERT: 存在すれば更新、なければ新規作成
  const existing = await db.query.propertyDocumentItems.findFirst({
    where: and(
      eq(propertyDocumentItems.propertyId, data.propertyId),
      eq(propertyDocumentItems.itemType, data.itemType)
    ),
  });

  if (existing) {
    await db
      .update(propertyDocumentItems)
      .set({
        status: data.status,
        updatedAt: now,
        updatedBy: session.user.id,
      })
      .where(eq(propertyDocumentItems.id, existing.id));
  } else {
    await db.insert(propertyDocumentItems).values({
      propertyId: data.propertyId,
      itemType: data.itemType,
      status: data.status,
      updatedAt: now,
      updatedBy: session.user.id,
    });
  }

  revalidatePath("/properties");
  revalidatePath("/properties/unconfirmed");
}

/**
 * 案件の号室を更新（インライン編集用）
 */
export async function updatePropertyRoomNumber(data: {
  id: string;
  roomNumber: string | null;
}) {
  const session = await verifySession();

  await db
    .update(properties)
    .set({
      roomNumber: data.roomNumber?.trim() || null,
      updatedBy: session.user.id,
      updatedAt: new Date(),
    })
    .where(eq(properties.id, data.id));

  revalidatePath("/properties");
  revalidatePath("/properties/unconfirmed");
}
