"use server";

import { db } from "@workspace/drizzle/db";
import {
  properties,
  propertyStaff,
  contractProgress,
  documentProgress,
  settlementProgress,
} from "@workspace/drizzle/schemas";
import {
  propertyCreateSchema,
  propertyUpdateSchema,
  type PropertyCreate,
  type PropertyUpdate,
} from "@workspace/drizzle/zod-schemas";
import type { InsertProperty } from "@workspace/drizzle/types";
import { auth } from "@workspace/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { verifySession } from "../data/sesstion";

/**
 * 案件を新規作成する
 */
export async function createProperty(data: PropertyCreate) {
  // セッション認証
  const session = await verifySession();

  // バリデーション
  const validatedData = propertyCreateSchema.parse(data);

  // トランザクションで案件と関連データを作成
  const result = await db.transaction(async (tx) => {
    // 利益を自動計算（出口金額 - A金額 + 仲手等）
    let profit: number | undefined = undefined;
    if (
      validatedData.amountExit !== undefined &&
      validatedData.amountA !== undefined
    ) {
      profit = validatedData.amountExit - validatedData.amountA;
      if (validatedData.commission !== undefined) {
        profit += validatedData.commission;
      }
    }

    // 1. 案件本体を作成
    const propertyData: InsertProperty = {
      organizationId: validatedData.organizationId,
      propertyName: validatedData.propertyName,
      roomNumber: validatedData.roomNumber || undefined,
      ownerName: validatedData.ownerName,
      amountA: validatedData.amountA || undefined,
      amountExit: validatedData.amountExit || undefined,
      commission: validatedData.commission || undefined,
      profit: profit || undefined,
      bcDeposit: validatedData.bcDeposit || undefined,
      contractDateA: validatedData.contractDateA
        ? new Date(validatedData.contractDateA)
        : undefined,
      contractDateBc: validatedData.contractDateBc
        ? new Date(validatedData.contractDateBc)
        : undefined,
      settlementDate: validatedData.settlementDate
        ? new Date(validatedData.settlementDate)
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
      documentStatus:
        (validatedData.documentStatus as InsertProperty["documentStatus"]) ||
        "waiting_request",
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
      throw new Error("案件の作成に失敗しました");
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

    // 3. 契約進捗を初期化
    await tx.insert(contractProgress).values({
      propertyId: property.id,
    });

    // 4. 書類進捗を初期化
    await tx.insert(documentProgress).values({
      propertyId: property.id,
      updatedBy: session.user.id,
    });

    // 5. 決済進捗を初期化
    await tx.insert(settlementProgress).values({
      propertyId: property.id,
    });

    return property;
  });

  revalidatePath("/properties");
  return result;
}

/**
 * 案件を更新する
 */
export async function updateProperty(data: PropertyUpdate) {
  // セッション認証
  const session = await verifySession();

  // バリデーション
  const validatedData = propertyUpdateSchema.parse(data);

  // トランザクションで案件と関連データを更新
  const result = await db.transaction(async (tx) => {
    // 利益を自動計算（出口金額 - A金額 + 仲手等）
    let profit: number | undefined = undefined;
    if (
      validatedData.amountExit !== undefined &&
      validatedData.amountA !== undefined
    ) {
      profit = validatedData.amountExit - validatedData.amountA;
      if (validatedData.commission !== undefined) {
        profit += validatedData.commission;
      }
    }

    // 1. 案件本体を更新
    const [property] = await tx
      .update(properties)
      .set({
        organizationId: validatedData.organizationId,
        propertyName: validatedData.propertyName,
        roomNumber: validatedData.roomNumber || undefined,
        ownerName: validatedData.ownerName,
        amountA: validatedData.amountA || undefined,
        amountExit: validatedData.amountExit || undefined,
        commission: validatedData.commission || undefined,
        profit: profit || undefined,
        bcDeposit: validatedData.bcDeposit || undefined,
        contractDateA: validatedData.contractDateA
          ? new Date(validatedData.contractDateA)
          : undefined,
        contractDateBc: validatedData.contractDateBc
          ? new Date(validatedData.contractDateBc)
          : undefined,
        settlementDate: validatedData.settlementDate
          ? new Date(validatedData.settlementDate)
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
          undefined,
        documentStatus:
          (validatedData.documentStatus as InsertProperty["documentStatus"]) ||
          undefined,
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

    const now = new Date();

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

    return property;
  });

  revalidatePath("/properties");
  revalidatePath(`/properties/${validatedData.id}`);
  return result;
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
}) {
  // セッション認証
  const session = await verifySession();

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
}

/**
 * 案件の書類ステータスを更新（インライン編集用）
 */
export async function updatePropertyDocumentStatus(data: {
  id: string;
  documentStatus: string;
}) {
  // セッション認証
  const session = await verifySession();

  await db
    .update(properties)
    .set({
      documentStatus: data.documentStatus as InsertProperty["documentStatus"],
      updatedBy: session.user.id,
      updatedAt: new Date(),
    })
    .where(eq(properties.id, data.id));

  revalidatePath("/properties");
  revalidatePath("/properties/unconfirmed");
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

  await db
    .update(properties)
    .set({
      settlementDate: data.settlementDate,
      updatedBy: session.user.id,
      updatedAt: new Date(),
    })
    .where(eq(properties.id, data.id));

  revalidatePath("/properties");
  revalidatePath("/properties/unconfirmed");
  // 月次ビューも更新
  if (data.settlementDate) {
    const year = data.settlementDate.getFullYear();
    const month = data.settlementDate.getMonth() + 1;
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
}) {
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
