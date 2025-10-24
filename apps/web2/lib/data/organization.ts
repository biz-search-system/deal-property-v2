import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getOrganizations() {
  const result = await auth.api.listOrganizations({
    headers: await headers(),
  });

  return result || [];
}

export async function getOrganizationsWithUserRole(userId: string) {
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  if (!organizations || organizations.length === 0) {
    return [];
  }

  // 各組織での現在のユーザーのロールを取得
  const orgsWithRole = await Promise.all(
    organizations.map(async (org) => {
      const fullOrg = await auth.api.getFullOrganization({
        query: { organizationId: org.id },
        headers: await headers(),
      });

      // 現在のユーザーのメンバー情報を探す
      const currentUserMember = fullOrg?.members.find(
        (m) => m.userId === userId
      );

      return {
        id: org.id,
        name: org.name,
        slug: org.slug,
        logo: org.logo,
        metadata: org.metadata,
        createdAt: org.createdAt,
        userRole: currentUserMember?.role || "member",
        memberCount: fullOrg?.members.length || 0,
      };
    })
  );

  return orgsWithRole;
}

export async function getActiveOrganization(activeOrgId: string) {
  const result = await auth.api.getFullOrganization({
    query: {
      organizationId: activeOrgId,
    },
    headers: await headers(),
  });

  return result;
}

export async function getFullOrganization(
  organizationId?: string,
  membersLimit: number = 100
) {
  const result = await auth.api.getFullOrganization({
    query: {
      organizationId,
      membersLimit,
    },
    headers: await headers(),
  });

  return result;
}

export async function getOrganizationMembers(
  organizationId: string,
  membersLimit: number = 100
) {
  const result = await auth.api.listMembers({
    query: { organizationId, limit: membersLimit, offset: 0 },
    headers: await headers(),
  });

  return result;
}

export async function getOrganizationInvitations(organizationId: string) {
  const result = await auth.api.listInvitations({
    query: { organizationId },
    headers: await headers(),
  });
  return result;
}
