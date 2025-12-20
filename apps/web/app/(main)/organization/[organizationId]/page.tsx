import { BreadcrumbConfig } from "@/components/breadcrumb-provider";
import { getFullOrganization } from "@/lib/data/organization";
import { verifySession } from "@/lib/data/sesstion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Mail, UserPlus, Users, Users2 } from "lucide-react";
import { InvitationsTab } from "./components/invitations-tab";
import { InviteTab } from "./components/invite-tab";
import { MembersTab } from "./components/members-tab";
import { TeamsTab } from "./components/teams-tab";

export const metadata = {
  title: "メンバー管理",
  description: "組織のメンバーと招待を管理します",
};

export default async function OrganizationMembersPage({
  params,
}: PageProps<"/organization/[organizationId]">) {
  const { organizationId } = await params;

  // 現在のユーザーのセッションを取得
  const session = await verifySession();
  const fullOrg = await getFullOrganization(organizationId);
  const currentUserMember = fullOrg?.members.find(
    (m) => m.userId === session.user.id
  );
  const userRole = currentUserMember?.role;

  return (
    <div className="container mx-auto py-6 space-y-8">
      <BreadcrumbConfig
        items={[
          { label: "組織管理", href: "/organization" },
          { label: "メンバー管理" },
        ]}
      />
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
          <TabsTrigger value="teams">
            <Users2 className="size-4 mr-2" />
            チーム
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

        <TabsContent value="teams">
          <TeamsTab organizationId={organizationId} userRole={userRole} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
