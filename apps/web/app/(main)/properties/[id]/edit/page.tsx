import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import PropertyFormProvider from "@/components/property/property-form-provider";
import PropertyFormActions from "@/components/property/property-form-actions";
import BasicInfoTab from "@/components/property/tabs/basic-info-tab";
import ContractProgressTab from "@/components/property/tabs/contract-progress-tab";
import DocumentProgressTab from "@/components/property/tabs/document-progress-tab";
import SettlementProgressTab from "@/components/property/tabs/settlement-progress-tab";
import { getPropertyById } from "@/lib/data/property";
import { getOrganizations, getSalesTeamMembers } from "@/lib/data/organization";
import { auth } from "@workspace/auth";
import { headers } from "next/headers";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/properties/[id]/edit">): Promise<Metadata> {
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
}: PageProps<"/properties/[id]/edit">) {
  const { id } = await params;

  // セッション取得
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // プロパティを取得
  const property = await getPropertyById(id);

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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">案件編集</h1>
      </div>

      <PropertyFormProvider
        mode="edit"
        defaultValues={{
          ...property,
          staffIds,
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{property.propertyName}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">基本情報</TabsTrigger>
                <TabsTrigger value="contract">契約進捗</TabsTrigger>
                <TabsTrigger value="document">書類進捗</TabsTrigger>
                <TabsTrigger value="settlement">決済進捗</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="mt-6">
                <BasicInfoTab
                  availableStaff={availableStaff}
                  organizations={organizations}
                  defaultOrganizationId={property.organizationId}
                />
              </TabsContent>

              <TabsContent value="contract" className="mt-6">
                <ContractProgressTab />
              </TabsContent>

              <TabsContent value="document" className="mt-6">
                <DocumentProgressTab />
              </TabsContent>

              <TabsContent value="settlement" className="mt-6">
                <SettlementProgressTab />
              </TabsContent>
            </Tabs>

            <PropertyFormActions mode="edit" />
          </CardContent>
        </Card>
      </PropertyFormProvider>
    </div>
  );
}
