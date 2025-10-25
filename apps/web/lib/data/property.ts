import "server-only";

import { db } from "@workspace/drizzle/db";
import { properties } from "@workspace/drizzle/schemas/property";
import { eq } from "drizzle-orm";

/**
 * 全案件を取得
 */
export async function getProperties() {
  return db.query.properties.findMany({
    with: {
      staff: {
        with: {
          user: true,
        },
      },
      contractProgress: true,
      documentProgress: true,
      settlementProgress: true,
    },
    orderBy: (props, { desc }) => [desc(props.createdAt)],
  });
}

/**
 * IDで案件を取得
 */
export async function getPropertyById(id: string) {
  return db.query.properties.findFirst({
    where: eq(properties.id, id),
    with: {
      staff: {
        with: {
          user: true,
        },
      },
      contractProgress: true,
      documentProgress: true,
      settlementProgress: true,
    },
  });
}

/**
 * 組織内の全ユーザーを取得（担当者選択用）
 */
export async function getOrganizationUsers() {
  // TODO: 組織機能実装時に組織でフィルタリング
  return db.query.users.findMany({
    columns: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: (u, { asc }) => [asc(u.name)],
  });
}
