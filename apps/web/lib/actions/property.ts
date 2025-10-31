"use server";

import { db } from "@workspace/drizzle/db";
import {
  properties,
  propertyStaff,
  contractProgress,
  documentProgress,
  settlementProgress,
} from "@workspace/drizzle/schemas/property";
import {
  propertyCreateSchema,
  propertyUpdateSchema,
  type PropertyCreate,
  type PropertyUpdate,
} from "@workspace/drizzle/zod/index";
import type { InsertProperty } from "@workspace/drizzle/types/property";
import { auth } from "@workspace/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

/**
 * 案件を新規作成する
 */
export async function createProperty(data: PropertyCreate) {
  // セッション確認
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("認証が必要です");
  }

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
  // セッション確認
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("認証が必要です");
  }

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
  // セッション確認
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("認証が必要です");
  }

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("認証が必要です");
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
}

/**
 * 案件の書類ステータスを更新（インライン編集用）
 */
export async function updatePropertyDocumentStatus(data: {
  id: string;
  documentStatus: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("認証が必要です");
  }

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("認証が必要です");
  }

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
