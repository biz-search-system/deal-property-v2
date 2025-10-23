import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Mail, UserPlus } from "lucide-react";
import { MembersTab } from "./components/members-tab";
import { InvitationsTab } from "./components/invitations-tab";
import { InviteTab } from "./components/invite-tab";

export const metadata = {
  title: "メンバー管理",
  description: "組織のメンバーと招待を管理します",
};

export default async function OrganizationMembersPage({
  params,
}: PageProps<"/organization/[organizationId]">) {
  const { organizationId } = await params;

  return (
    <div className="container mx-auto py-6 space-y-8">
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">
            <Users className="size-4 mr-2" />
            メンバー
          </TabsTrigger>
          <TabsTrigger value="invitations">
            <Mail className="size-4 mr-2" />
            招待状
          </TabsTrigger>
          <TabsTrigger value="invite">
            <UserPlus className="size-4 mr-2" />
            新規招待
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <MembersTab organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="invitations">
          <InvitationsTab organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="invite">
          <InviteTab organizationId={organizationId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
