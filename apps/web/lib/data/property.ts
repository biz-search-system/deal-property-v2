import "server-only";

import { db } from "@workspace/drizzle/db";
import { properties } from "@workspace/drizzle/schemas";
import { and, eq, gte, lte, not, isNull } from "drizzle-orm";
import type { DocumentStatus, ProgressStatus } from "@workspace/drizzle/types";
import { getOrganizations } from "@/lib/data/organization";
import { cache } from "react";

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
export const getPropertyById = cache(async (id: string) => {
  return db.query.properties.findFirst({
    where: eq(properties.id, id),
    with: {
      organization: true,
      staff: {
        with: {
          user: true,
        },
      },
      // 進捗ステータス更新者ユーザー情報
      progressStatusUpdatedByUser: {
        columns: { id: true, name: true, email: true, image: true },
      },
      // 書類ステータス更新者ユーザー情報
      documentStatusUpdatedByUser: {
        columns: { id: true, name: true, email: true, image: true },
      },
      // スケジュール更新者ユーザー情報
      contractDateAUpdatedByUser: {
        columns: { id: true, name: true, email: true, image: true },
      },
      contractDateBcUpdatedByUser: {
        columns: { id: true, name: true, email: true, image: true },
      },
      settlementDateUpdatedByUser: {
        columns: { id: true, name: true, email: true, image: true },
      },
      contractProgress: {
        with: {
          // マイソク配布の更新者ユーザー情報
          maisokuDistributionByUser: {
            columns: { id: true, name: true, email: true, image: true },
          },
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
      // 書類項目（更新者ユーザー情報付き）
      documentItems: {
        with: {
          updatedByUser: {
            columns: { id: true, name: true, email: true, image: true },
          },
        },
      },
      settlementProgress: {
        with: {
          // 精算書関係の更新者ユーザー情報
          bcSettlementStatusByUser: {
            columns: { id: true, name: true, email: true, image: true },
          },
          abSettlementStatusByUser: {
            columns: { id: true, name: true, email: true, image: true },
          },
          // 司法書士関係の更新者ユーザー情報
          lawyerRequestedByUser: {
            columns: { id: true, name: true, email: true, image: true },
          },
          documentsSharedByUser: {
            columns: { id: true, name: true, email: true, image: true },
          },
          // 賃貸管理関係の更新者ユーザー情報
          managementCancelScheduledMonthByUser: {
            columns: { id: true, name: true, email: true, image: true },
          },
          managementCancelRequestedDateByUser: {
            columns: { id: true, name: true, email: true, image: true },
          },
          managementCancelCompletedDateByUser: {
            columns: { id: true, name: true, email: true, image: true },
          },
        },
      },
    },
  });
});

/**
 * 月次案件一覧用のデータ取得
 * 決済日が指定月内かつBC確定前以外の案件を取得
 */
export async function getMonthlyProperties(
  year: number,
  month: number,
  organizationId: string
) {
  // 月の開始日と終了日を計算
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const conditions = [
    eq(properties.organizationId, organizationId),
    // BC確定前以外
    not(eq(properties.progressStatus, "bc_before_confirmed")),
    // 決済日が存在し、指定月内
    not(isNull(properties.settlementDate)),
    gte(properties.settlementDate, startDate),
    lte(properties.settlementDate, endDate),
  ];

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
 * 全組織の月次案件を取得
 * @param year 年
 * @param month 月
 * @returns 月次案件リスト
 */
export async function getMonthlyPropertiesByOrganizations(
  year: number,
  month: number
) {
  const organizations = await getOrganizations();
  if (!organizations || organizations.length === 0) {
    return [];
  }
  const properties = await Promise.all(
    organizations.map((org) => getMonthlyProperties(year, month, org.id))
  );
  return properties.flat();
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
 * 指定組織のBC確定前案件を決済日順で取得
 */
async function getUnconfirmedPropertiesBySettlementDate(
  organizationId: string
) {
  return db.query.properties.findMany({
    where: and(
      eq(properties.organizationId, organizationId),
      eq(properties.progressStatus, "bc_before_confirmed")
    ),
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
 * 全組織のBC確定前案件を組織順・決済日順で取得
 * ユーザーが所属する組織の案件のみを取得し、
 * 組織の順序を保持して決済日順で返す
 */
export async function getAllUnconfirmedPropertiesBySettlementDate() {
  // ユーザーの所属組織を取得（既にソート済み）
  const organizations = await getOrganizations();

  if (!organizations || organizations.length === 0) {
    return [];
  }

  // 各組織のBC確定前案件を並列で取得
  const propertyPromises = organizations.map((org) =>
    getUnconfirmedPropertiesBySettlementDate(org.id)
  );

  // 並列実行で高速化
  const propertiesByOrg = await Promise.all(propertyPromises);

  // 組織の順序を保持して結合
  return propertiesByOrg.flat();
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
      // asc(props.updatedAt),
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
