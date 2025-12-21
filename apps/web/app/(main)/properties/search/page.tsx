import { getAllPropertiesBySettlementDate } from "@/lib/data/property";
import { SearchProperties } from "../../../../components/property/search/search-properties";
import type { Metadata } from "next";
import { BreadcrumbConfig } from "@/components/breadcrumb-provider";

export const metadata: Metadata = {
  title: "案件検索",
};

export default async function SearchPage() {
  // 全案件を決済日順で取得
  const properties = await getAllPropertiesBySettlementDate();

  // データを変換（クライアント側で使いやすい形式に）
  const transformedProperties = properties.map((property) => ({
    ...property,
    // 担当者名を配列形式に変換
    assignee:
      property.staff?.map((s) => s.user?.name || "").filter(Boolean) || [],
    // 組織名
    organizationName: property.organization?.name || "",
  }));

  return (
    <>
      <BreadcrumbConfig items={[{ label: "案件検索" }]} />
      <SearchProperties properties={transformedProperties} />;
    </>
  );
}
