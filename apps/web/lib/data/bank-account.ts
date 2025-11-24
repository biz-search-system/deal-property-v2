import "server-only";

import { db } from "@workspace/drizzle/db";
import { properties } from "@workspace/drizzle/schemas";
import { eq, and, sql } from "drizzle-orm";
import type { AccountCompany, BankAccount } from "@workspace/drizzle/types";

/**
 * 同日同口座の合計金額を取得
 * @param date 決済日
 * @param accountCompany 口座会社
 * @param bankAccount 銀行口座
 * @param excludePropertyId 除外する物件ID（編集時の自己参照を防ぐため）
 * @returns 合計金額と件数
 */
export async function getBankAccountDailyTotal({
  date,
  accountCompany,
  bankAccount,
  excludePropertyId,
}: {
  date: Date;
  accountCompany: AccountCompany;
  bankAccount: BankAccount;
  excludePropertyId?: string;
}) {
  const conditions = [
    eq(properties.settlementDate, date),
    eq(properties.accountCompany, accountCompany),
    eq(properties.bankAccount, bankAccount),
    // 決済日ベースで管理するため、progressStatusに関わらず全件を対象とする
  ];

  if (excludePropertyId) {
    conditions.push(sql`${properties.id} != ${excludePropertyId}`);
  }

  const result = await db
    .select({
      total: sql<number>`COALESCE(SUM(${properties.amountExit}), 0)`,
      count: sql<number>`COUNT(*)`,
    })
    .from(properties)
    .where(and(...conditions));

  return {
    total: Number(result[0]?.total || 0),
    count: Number(result[0]?.count || 0),
  };
}

/**
 * 特定物件の口座情報を取得
 * @param propertyId 物件ID
 * @returns 物件の口座関連情報
 */
export async function getPropertyBankInfo(propertyId: string) {
  const property = await db.query.properties.findFirst({
    where: eq(properties.id, propertyId),
    columns: {
      id: true,
      settlementDate: true,
      amountExit: true,
      accountCompany: true,
      bankAccount: true,
      organizationId: true,
      progressStatus: true,
    },
  });

  return property;
}

/**
 * 特定日の口座別使用状況を取得
 * @param date 決済日
 * @param organizationId 組織ID（オプション）
 * @returns 口座別の使用金額と件数
 */
export async function getDailyBankAccountUsage(
  date: Date,
  organizationId?: string,
) {
  const conditions = [eq(properties.settlementDate, date)];

  if (organizationId) {
    conditions.push(eq(properties.organizationId, organizationId));
  }

  const result = await db
    .select({
      accountCompany: properties.accountCompany,
      bankAccount: properties.bankAccount,
      total: sql<number>`COALESCE(SUM(${properties.amountExit}), 0)`,
      count: sql<number>`COUNT(*)`,
    })
    .from(properties)
    .where(and(...conditions))
    .groupBy(properties.accountCompany, properties.bankAccount);

  return result.map((row) => ({
    accountCompany: row.accountCompany,
    bankAccount: row.bankAccount,
    total: Number(row.total),
    count: Number(row.count),
  }));
}

/**
 * 月次の口座別決済予定を取得
 * @param startDate 開始日
 * @param endDate 終了日
 * @param organizationId 組織ID（オプション）
 * @returns 月次の口座別集計
 */
export async function getMonthlyBankAccountSummary(
  startDate: Date,
  endDate: Date,
  organizationId?: string,
) {
  const conditions = [
    sql`${properties.settlementDate} BETWEEN ${startDate} AND ${endDate}`,
  ];

  if (organizationId) {
    conditions.push(eq(properties.organizationId, organizationId));
  }

  const result = await db
    .select({
      settlementDate: properties.settlementDate,
      accountCompany: properties.accountCompany,
      bankAccount: properties.bankAccount,
      total: sql<number>`COALESCE(SUM(${properties.amountExit}), 0)`,
      count: sql<number>`COUNT(*)`,
    })
    .from(properties)
    .where(and(...conditions))
    .groupBy(
      properties.settlementDate,
      properties.accountCompany,
      properties.bankAccount,
    )
    .orderBy(
      properties.settlementDate,
      properties.accountCompany,
      properties.bankAccount,
    );

  return result.map((row) => ({
    settlementDate: row.settlementDate,
    accountCompany: row.accountCompany,
    bankAccount: row.bankAccount,
    total: Number(row.total),
    count: Number(row.count),
  }));
}
