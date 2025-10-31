import { MonthlyPropertiesClient } from "./monthly-properties-client";
import { getMonthlyProperties } from "@/lib/data/property";
import { auth } from "@workspace/auth";
import { headers } from "next/headers";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/properties/monthly/[year]/[month]">): Promise<Metadata> {
  const { year, month } = await params;
  return {
    title: `${year}年${month}月 - 月次案件一覧`,
  };
}

export default async function MonthlyPropertiesPage({
  params,
}: PageProps<"/properties/monthly/[year]/[month]">) {
  const { year, month } = await params;

  // セッション取得
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // 月次案件を取得（DBでフィルタリング済み）
  const monthlyProperties = await getMonthlyProperties(
    Number(year),
    Number(month)
  );

  // データを変換（クライアント側で使いやすい形式に）
  const transformedProperties = monthlyProperties.map((property) => ({
    ...property,
    // 担当者名を配列形式に変換
    assignee:
      property.staff?.map((s: any) => s.user?.name || "").filter(Boolean) || [],
    // 組織名
    organizationName: property.organization?.name || "",
  }));

  return (
    <MonthlyPropertiesClient
      year={year}
      month={month}
      properties={transformedProperties}
    />
  );
}
