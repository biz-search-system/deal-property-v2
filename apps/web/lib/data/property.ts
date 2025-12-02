import "server-only";

import { db } from "@workspace/drizzle/db";
import { properties } from "@workspace/drizzle/schemas";
import { and, eq, gte, lte, not, isNull } from "drizzle-orm";
import type { DocumentStatus, ProgressStatus } from "@workspace/drizzle/types";
import { getOrganizations } from "@/lib/data/organization";

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
      contractProgress: {
        with: {
          // AB関係の更新者ユーザー情報（必要なカラムのみ）
          abContractSavedByUser: {
            columns: { id: true, name: true, email: true, image: true },
          },
          abAuthorizationSavedByUser: {
            columns: { id: true, name: true, email: true, image: true },
          },
          abSellerIdSavedByUser: {
            columns: { id: true, name: true, email: true, image: true },
          },
          // BC関係の更新者ユーザー情報（必要なカラムのみ）
          bcContractCreatedByUser: {
            columns: { id: true, name: true, email: true, image: true },
          },
          bcDescriptionCreatedByUser: {
            columns: { id: true, name: true, email: true, image: true },
          },
          bcContractSentByUser: {
            columns: { id: true, name: true, email: true, image: true },
          },
          bcDescriptionSentByUser: {
            columns: { id: true, name: true, email: true, image: true },
          },
          bcContractCbDoneByUser: {
            columns: { id: true, name: true, email: true, image: true },
          },
          bcDescriptionCbDoneByUser: {
            columns: { id: true, name: true, email: true, image: true },
          },
        },
      },
      documentProgress: true,
      settlementProgress: true,
    },
  });
}

/**
 * 月次案件一覧用のデータ取得
 * 決済日が指定月内かつBC確定前以外の案件を取得
 */
export async function getMonthlyProperties(
  year: number,
  month: number,
  organizationId?: string
) {
  // 月の開始日と終了日を計算
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const conditions = [
    // BC確定前以外
    not(eq(properties.progressStatus, "bc_before_confirmed")),
    // 決済日が存在し、指定月内
    not(isNull(properties.settlementDate)),
    gte(properties.settlementDate, startDate),
    lte(properties.settlementDate, endDate),
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
  const conditions = [eq(properties.progressStatus, "bc_before_confirmed")];

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

/**
 * 指定組織の案件を決済日順で取得
 * @param organizationId 組織ID
 * @returns 指定組織の案件リスト（決済日の昇順、次に更新日の降順）
 */
export async function getPropertiesBySettlementDate(organizationId: string) {
  return db.query.properties.findMany({
    where: eq(properties.organizationId, organizationId),
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
    orderBy: (props, { asc }) => [
      asc(props.settlementDate),
      asc(props.updatedAt),
    ],
  });
}

/**
 * 全案件を組織ごとに決済日順で取得（検索画面用）
 * ユーザーが所属する組織の案件のみを取得し、
 * 組織の順序（レイジット → エスク → シャインテラス）を保持して返す
 */
export async function getAllPropertiesBySettlementDate() {
  // ユーザーの所属組織を取得（既にソート済み）
  const organizations = await getOrganizations();

  if (!organizations || organizations.length === 0) {
    return [];
  }

  // 各組織の案件を並列で取得
  const propertyPromises = organizations.map((org) =>
    getPropertiesBySettlementDate(org.id)
  );

  // 並列実行で高速化
  const propertiesByOrg = await Promise.all(propertyPromises);

  // 組織の順序を保持して結合
  return propertiesByOrg.flat();
}
