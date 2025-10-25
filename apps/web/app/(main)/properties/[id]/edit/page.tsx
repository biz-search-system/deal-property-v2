import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import PropertyFormProvider from "@/components/property/property-form-provider";
import PropertyFormActions from "@/components/property/property-form-actions";
import BasicInfoTab from "@/components/property/tabs/basic-info-tab";
import ContractProgressTab from "@/components/property/tabs/contract-progress-tab";
import DocumentProgressTab from "@/components/property/tabs/document-progress-tab";
import SettlementProgressTab from "@/components/property/tabs/settlement-progress-tab";
import { getPropertyById, getOrganizationUsers } from "@/lib/data/property";
import type { Metadata } from "next";

export async function generateMetadata({ params }: PageProps<"/properties/[id]/edit">): Promise<Metadata> {
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

export default async function PropertyEditPage({ params }: PageProps<"/properties/[id]/edit">) {
  const { id } = await params;

  const [property, availableStaff] = await Promise.all([
    getPropertyById(id),
    getOrganizationUsers(),
  ]);

  if (!property) {
    notFound();
  }

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
                <BasicInfoTab availableStaff={availableStaff} />
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
