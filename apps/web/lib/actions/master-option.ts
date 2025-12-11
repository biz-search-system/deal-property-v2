"use server";

import { db } from "@workspace/drizzle/db";
import { masterOptions } from "@workspace/drizzle/schemas";
import type { MasterOptionCategory } from "@workspace/drizzle/schemas";
import { and, eq } from "drizzle-orm";
import { verifySession } from "../data/sesstion";

/**
 * マスタオプションを追加する
 */
export async function createMasterOption(data: {
  category: MasterOptionCategory;
  value: string;
  organizationId?: string;
}) {
  const session = await verifySession();

  // 重複チェック
  const existing = await db.query.masterOptions.findFirst({
    where: and(
      eq(masterOptions.category, data.category),
      eq(masterOptions.value, data.value),
      data.organizationId
        ? eq(masterOptions.organizationId, data.organizationId)
        : undefined
    ),
  });

  if (existing) {
    return existing;
  }

  const [result] = await db
    .insert(masterOptions)
    .values({
      category: data.category,
      value: data.value,
      organizationId: data.organizationId || null,
      createdBy: session.user.id,
    })
    .returning();

  return result;
}

/**
 * マスタオプションを削除する
 */
export async function deleteMasterOption(id: string) {
  await verifySession();

  await db.delete(masterOptions).where(eq(masterOptions.id, id));

  return { success: true };
}
