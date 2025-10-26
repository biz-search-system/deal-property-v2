import "server-only";

import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { db } from "@workspace/drizzle/db";
import { teams, teamMembers } from "@workspace/drizzle/schemas/auth";
import { eq, count } from "drizzle-orm";

/**
 * 組織のチーム一覧を取得
 */
export async function getOrganizationTeams(organizationId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Better Auth のチーム一覧取得APIを使用
  const result = await auth.api.listOrganizationTeams({
    query: { organizationId },
    headers: await headers(),
  });

  return result;
}

/**
 * チームメンバー一覧を取得
 */
export async function getTeamMembers(teamId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Better Auth のチームメンバー取得APIを使用
  const result = await auth.api.listTeamMembers({
    query: { teamId },
    headers: await headers(),
  });

  return result;
}

/**
 * チーム詳細を取得（メンバー数含む）
 */
export async function getTeamWithMemberCount(teamId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const teamData = await db.query.teams.findFirst({
    where: eq(teams.id, teamId),
  });

  if (!teamData) {
    throw new Error("Team not found");
  }

  const memberCountResult = await db
    .select({ value: count() })
    .from(teamMembers)
    .where(eq(teamMembers.teamId, teamId));

  return {
    ...teamData,
    memberCount: memberCountResult[0]?.value || 0,
  };
}

/**
 * 組織のチーム一覧をメンバー数付きで取得
 */
export async function getOrganizationTeamsWithMemberCount(
  organizationId: string
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const teamsData = await db.query.teams.findMany({
    where: eq(teams.organizationId, organizationId),
  });

  // 各チームのメンバー数を取得
  const teamsWithCount = await Promise.all(
    teamsData.map(async (team) => {
      const memberCountResult = await db
        .select({ value: count() })
        .from(teamMembers)
        .where(eq(teamMembers.teamId, team.id));

      return {
        ...team,
        memberCount: memberCountResult[0]?.value || 0,
      };
    })
  );

  return teamsWithCount;
}