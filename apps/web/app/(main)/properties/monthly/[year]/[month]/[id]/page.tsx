import { BreadcrumbConfig } from "@/components/breadcrumb-provider";
import { PropertyDetailView } from "@/components/property/property-detail-view";
import { getPropertyById } from "@/lib/data/property";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: PageProps<"/properties/monthly/[year]/[month]/[id]">): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return {
      title: "案件が見つかりません",
    };
  }

  return {
    title: `${property.propertyName} - 案件詳細`,
  };
}

export default async function PropertyDetailPage({
  params,
}: PageProps<"/properties/monthly/[year]/[month]/[id]">) {
  const { id, year, month } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <BreadcrumbConfig
        items={[
          {
            label: "月次案件一覧",
            href: `/properties/monthly/${year}/${month}`,
          },
          { label: "案件詳細" },
        ]}
      />

      <div className="min-h-0 flex-1 overflow-auto">
        <PropertyDetailView property={property} />
      </div>
    </div>
  );
}
