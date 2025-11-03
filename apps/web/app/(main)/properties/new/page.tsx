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
import { getOrganizations, getSalesTeamMembers } from "@/lib/data/organization";
import { verifySession } from "@/lib/data/sesstion";

export const metadata = {
  title: "案件登録",
};

export default async function PropertyNewPage() {
  // セッション取得
  const session = await verifySession();
  // ユーザーが所属している組織一覧を取得
  const organizations = await getOrganizations();
  // デフォルト組織IDを取得
  const activeOrganizationId = session.session.activeOrganizationId;
  // デフォルト組織の営業チームメンバーを取得
  const availableStaff = activeOrganizationId
    ? await getSalesTeamMembers(activeOrganizationId)
    : [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">案件登録</h1>
      </div>

      <PropertyFormProvider
        mode="create"
        defaultValues={{
          organizationId: activeOrganizationId || "",
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>案件情報</CardTitle>
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

            <PropertyFormActions mode="create" />
          </CardContent>
        </Card>
      </PropertyFormProvider>
    </div>
  );
}
