import { getAllPropertiesByUpdated } from "@/lib/data/property";
import { SearchPropertiesClient } from "./search-properties-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "案件検索",
};

export default async function SearchPage() {
  // 全案件を更新順で取得
  const properties = await getAllPropertiesByUpdated();

  // データを変換（クライアント側で使いやすい形式に）
  const transformedProperties = properties.map((property) => ({
    ...property,
    // 担当者名を配列形式に変換
    assignee:
      property.staff?.map((s) => s.user?.name || "").filter(Boolean) || [],
    // 組織名
    organizationName: property.organization?.name || "",
  }));

  return <SearchPropertiesClient properties={transformedProperties} />;
}
