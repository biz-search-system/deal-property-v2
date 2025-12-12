import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import PropertyFormProvider from "@/components/property/property-form-provider";
import { PropertyProvider } from "@/components/property/property-provider";
import PropertyFormActions from "@/components/property/property-form-actions";
import { PropertyFormTabs } from "@/components/property/property-form-tabs";
import { getPropertyById } from "@/lib/data/property";
import { getOrganizations, getSalesTeamMembers } from "@/lib/data/organization";
import type { Metadata } from "next";
import { verifySession } from "@/lib/data/sesstion";
import { BreadcrumbConfig } from "@/components/breadcrumb-provider";

export async function generateMetadata({
  params,
}: PageProps<"/properties/unconfirmed/[id]/edit">): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return {
      title: "案件が見つかりません",
    };
  }

  return {
    title: `${property.propertyName} - 編集`,
  };
}

export default async function PropertyEditPage({
  params,
}: PageProps<"/properties/unconfirmed/[id]/edit">) {
  const { id } = await params;

  // セッション取得
  await verifySession();

  // プロパティを取得
  const property = await getPropertyById(id);
  // console.log(property);

  if (!property) {
    notFound();
  }

  // ユーザーが所属している組織一覧を取得
  const organizations = await getOrganizations();

  // 案件の組織IDに基づいて営業チームメンバーを取得
  const availableStaff = await getSalesTeamMembers(property.organizationId);

  // 担当者のIDリストを取得
  const staffIds = property.staff.map((s) => s.userId);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden p-3 lg:p-2">
      <BreadcrumbConfig
        items={[
          { label: "業者確定前", href: "/properties/unconfirmed" },
          { label: "案件編集" },
        ]}
      />
      <PropertyProvider property={property}>
        <PropertyFormProvider
          mode="edit"
          defaultValues={{
            ...property,
            staffIds,
            contractProgress: property.contractProgress,
          }}
        >
          <Card className="flex min-h-0 flex-1 flex-col gap-2 p-3 lg:p-5">
            <CardHeader className="shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle>{property.propertyName}</CardTitle>
                <PropertyFormActions mode="edit" />
              </div>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col px-3 lg:px-4">
              <PropertyFormTabs
                availableStaff={availableStaff}
                organizations={organizations}
              />
            </CardContent>
          </Card>
        </PropertyFormProvider>
      </PropertyProvider>
    </div>
  );
}
