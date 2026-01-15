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
import { notFound } from "next/navigation";
import { InvitationsTab } from "./components/invitations-tab";
import { InviteTab } from "./components/invite-tab";
import { MembersTab } from "./components/members-tab";
import { SetActiveOrganization } from "./components/set-active-organization";
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

  // 組織が存在しない、またはユーザーがメンバーでない場合は404
  const currentUserMember = fullOrg?.members.find(
    (m) => m.userId === session.user.id
  );
  if (!fullOrg || !currentUserMember) {
    notFound();
  }

  const userRole = currentUserMember.role;

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4 lg:p-6">
        <BreadcrumbConfig
          items={[
            { label: "組織管理", href: "/organization" },
            { label: fullOrg.name },
          ]}
        />
        <Tabs
          defaultValue="members"
          className="flex flex-1 flex-col overflow-hidden"
        >
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

          <TabsContent value="members" className="flex-1 overflow-hidden">
            <MembersTab organizationId={organizationId} />
          </TabsContent>

          <TabsContent value="invitations" className="flex-1 overflow-hidden">
            <InvitationsTab organizationId={organizationId} />
          </TabsContent>

          <TabsContent value="invite" className="flex-1 overflow-auto">
            <InviteTab organizationId={organizationId} />
          </TabsContent>

          <TabsContent value="teams" className="flex-1 overflow-hidden">
            <TeamsTab organizationId={organizationId} userRole={userRole} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
