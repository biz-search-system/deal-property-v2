"use server";

import { db } from "@workspace/drizzle/db";
import { selectOptions } from "@workspace/drizzle/schemas";
import type { SelectOptionCategory } from "@workspace/drizzle/schemas";
import { and, eq } from "drizzle-orm";
import { verifySession } from "../data/sesstion";

/**
 * セレクトオプションを追加する（全組織共通）
 */
export async function createSelectOption(data: {
  category: SelectOptionCategory;
  value: string;
}) {
  const session = await verifySession();

  // 重複チェック
  const existing = await db.query.selectOptions.findFirst({
    where: and(
      eq(selectOptions.category, data.category),
      eq(selectOptions.value, data.value)
    ),
  });

  if (existing) {
    return existing;
  }

  const [result] = await db
    .insert(selectOptions)
    .values({
      category: data.category,
      value: data.value,
      createdBy: session.user.id,
    })
    .returning();

  return result;
}

/**
 * セレクトオプションを削除する
 */
export async function deleteSelectOption(id: string) {
  await verifySession();

  await db.delete(selectOptions).where(eq(selectOptions.id, id));

  return { success: true };
}
