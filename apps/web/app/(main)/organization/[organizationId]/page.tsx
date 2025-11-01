import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Users, Mail, UserPlus, Users2 } from "lucide-react";
import { MembersTab } from "./components/members-tab";
import { InvitationsTab } from "./components/invitations-tab";
import { InviteTab } from "./components/invite-tab";
import { TeamsTab } from "./components/teams-tab";
import { getFullOrganization } from "@/lib/data/organization";
import { auth } from "@workspace/auth";
import { headers } from "next/headers";

export const metadata = {
  title: "メンバー管理",
  description: "組織のメンバーと招待を管理します",
};

export default async function OrganizationMembersPage({
  params,
}: PageProps<"/organization/[organizationId]">) {
  const { organizationId } = await params;

  // 現在のユーザーのセッションを取得
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 組織の詳細情報を取得してユーザーのロールを確認
  let userRole: string | undefined;
  if (session) {
    const fullOrg = await getFullOrganization(organizationId);
    const currentUserMember = fullOrg?.members.find(
      (m) => m.userId === session.user.id
    );
    userRole = currentUserMember?.role;
  }

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
