import "server-only";

import { db } from "@workspace/drizzle/db";
import { properties } from "@workspace/drizzle/schemas/property";
import { and, eq, gte, lte, not, isNull } from "drizzle-orm";
import type { ProgressStatus, DocumentStatus } from "@workspace/drizzle/types/property";

/**
 * 全案件を取得
 */
export async function getProperties() {
  return db.query.properties.findMany({
    with: {
      organization: true,
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
      organization: true,
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
 * 月次案件一覧用のデータ取得
 * 決済日が指定月内かつBC確定前以外の案件を取得
 */
export async function getMonthlyProperties(year: number, month: number, organizationId?: string) {
  // 月の開始日と終了日を計算
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const conditions = [
    // BC確定前以外
    not(eq(properties.progressStatus, "bc_before_confirmed")),
    // 決済日が存在し、指定月内
    not(isNull(properties.settlementDate)),
    gte(properties.settlementDate, startDate),
    lte(properties.settlementDate, endDate)
  ];

  // 組織IDが指定されていればフィルタに追加
  if (organizationId) {
    conditions.push(eq(properties.organizationId, organizationId));
  }

  return db.query.properties.findMany({
    where: and(...conditions),
    with: {
      organization: true,
      staff: {
        with: {
          user: true,
        },
      },
      contractProgress: true,
      documentProgress: true,
      settlementProgress: true,
    },
    orderBy: (props, { asc }) => [asc(props.settlementDate)],
  });
}

/**
 * BC確定前案件一覧用のデータ取得
 * 進捗が「BC確定前」の案件のみ取得
 */
export async function getUnconfirmedProperties(organizationId?: string) {
  const conditions = [
    eq(properties.progressStatus, "bc_before_confirmed")
  ];

  // 組織IDが指定されていればフィルタに追加
  if (organizationId) {
    conditions.push(eq(properties.organizationId, organizationId));
  }

  return db.query.properties.findMany({
    where: and(...conditions),
    with: {
      organization: true,
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
 * 案件一覧用のデータ取得（フィルタオプション付き）
 * 進捗状況や組織でフィルタリング可能
 */
export async function getFilteredProperties(options?: {
  organizationId?: string;
  progressStatus?: ProgressStatus;
  documentStatus?: DocumentStatus;
}) {
  const conditions = [];

  if (options?.organizationId) {
    conditions.push(eq(properties.organizationId, options.organizationId));
  }

  if (options?.progressStatus) {
    conditions.push(eq(properties.progressStatus, options.progressStatus));
  }

  if (options?.documentStatus) {
    conditions.push(eq(properties.documentStatus, options.documentStatus));
  }

  return db.query.properties.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    with: {
      organization: true,
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

