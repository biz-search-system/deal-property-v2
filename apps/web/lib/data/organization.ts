import "server-only";

import { auth } from "@workspace/auth";
import { headers } from "next/headers";

export async function getOrganizations() {
  const result = await auth.api.listOrganizations({
    headers: await headers(),
  });

  // DBのsortOrderでソート
  return [...result].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
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
        sortOrder: org.sortOrder,
        userRole: currentUserMember?.role || "member",
        memberCount: fullOrg?.members.length || 0,
      };
    })
  );

  // DBのsortOrderでソート
  return [...orgsWithRole].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );
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

  // console.log("result", result);

  return result;
}

export async function getOrganizationInvitations(organizationId: string) {
  const result = await auth.api.listInvitations({
    query: { organizationId },
    headers: await headers(),
  });
  return result;
}

/**
 * 組織の営業チームメンバーを取得
 */
export async function getSalesTeamMembers(organizationId: string) {
  // 組織の完全な情報を取得（メンバー含む）
  const fullOrg = await auth.api.getFullOrganization({
    query: { organizationId },
    headers: await headers(),
  });

  if (!fullOrg || !fullOrg.members) {
    return [];
  }

  // チーム一覧を取得
  const teamsResult = await auth.api.listOrganizationTeams({
    query: { organizationId },
    headers: await headers(),
  });

  const teams = teamsResult || [];

  // 営業チームを探す
  const salesTeam = teams.find(
    (team) => team.name === "営業" || team.name === "営業チーム"
  );

  if (!salesTeam) {
    // 営業チームがない場合は組織の全メンバーを返す
    return fullOrg.members.map((member) => ({
      id: member.userId,
      name: member.user?.name || "名前なし",
      email: member.user?.email || "",
      role: member.role || "member",
    }));
  }

  // 営業チームのメンバー一覧を取得
  try {
    const teamMembers = await auth.api.listTeamMembers({
      query: { teamId: salesTeam.id },
      headers: await headers(),
    });

    if (!teamMembers || teamMembers.length === 0) {
      // チームメンバーがいない場合は組織の全メンバーを返す
      return fullOrg.members.map((member) => ({
        id: member.userId,
        name: member.user?.name || "名前なし",
        email: member.user?.email || "",
        role: member.role || "member",
      }));
    }

    // チームメンバーのIDリストを作成
    const teamMemberIds = new Set(teamMembers.map((tm) => tm.userId));

    // fullOrgのメンバー情報から営業チームメンバーの詳細を取得
    return fullOrg.members
      .filter((member) => teamMemberIds.has(member.userId))
      .map((member) => ({
        id: member.userId,
        name: member.user?.name || "名前なし",
        email: member.user?.email || "",
        role: member.role || "member",
      }));
  } catch (error) {
    console.error(`Failed to get sales team members:`, error);
    // エラーの場合は組織の全メンバーを返す
    return fullOrg.members.map((member) => ({
      id: member.userId,
      name: member.user?.name || "名前なし",
      email: member.user?.email || "",
      role: member.role || "member",
    }));
  }
}

/**
 * 現在のユーザーの組織における情報を取得（役割とチーム情報含む）
 */
export async function getCurrentUserOrganizationInfo(organizationId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // 組織の詳細情報を取得
  const fullOrg = await auth.api.getFullOrganization({
    query: { organizationId },
    headers: await headers(),
  });

  if (!fullOrg) {
    throw new Error("Organization not found");
  }

  // 現在のユーザーのメンバー情報を探す
  const currentUserMember = fullOrg.members.find(
    (m) => m.userId === session.user.id
  );

  if (!currentUserMember) {
    throw new Error("Not a member of this organization");
  }

  // 組織のチーム一覧を取得
  const teamsResult = await auth.api.listOrganizationTeams({
    query: { organizationId },
    headers: await headers(),
  });

  const teams = teamsResult || [];

  // 各チームに対してユーザーが所属しているか確認
  const teamsWithMembership = await Promise.all(
    teams.map(async (team) => {
      let isMember = false;

      // オーナーは全てのチームにアクセス可能とみなす
      if (currentUserMember.role === "owner") {
        isMember = true;
      } else {
        // チームメンバー一覧を取得してユーザーが含まれているか確認
        try {
          const teamMembers = await auth.api.listTeamMembers({
            query: { teamId: team.id },
            headers: await headers(),
          });

          isMember =
            teamMembers?.some((member) => member.userId === session.user.id) ||
            false;
        } catch (error) {
          console.error(`Failed to get members for team ${team.id}:`, error);
        }
      }

      return {
        id: team.id,
        name: team.name,
        isMember,
      };
    })
  );

  return {
    user: {
      id: session.user.id,
      name: session.user.name || null,
      email: session.user.email,
    },
    role: currentUserMember.role,
    teams: teamsWithMembership,
  };
}
