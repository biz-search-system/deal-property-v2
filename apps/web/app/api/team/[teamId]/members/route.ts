import { NextRequest, NextResponse } from "next/server";
import { auth } from "@workspace/auth";
import { headers } from "next/headers";
import { getTeamMembers } from "@/lib/data/team";
import { TeamMembersResponse } from "@/lib/types/team";
import { db } from "@workspace/drizzle/db";
import { teams } from "@workspace/drizzle/schemas/auth";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/team/[teamId]/members">
): Promise<NextResponse<TeamMembersResponse>> {
  const { teamId } = await ctx.params;

  // セッション確認
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // チームが存在するか確認
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, teamId),
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // 組織の詳細情報を取得してメンバーか確認
    const fullOrg = await auth.api.getFullOrganization({
      query: { organizationId: team.organizationId },
      headers: await headers(),
    });

    if (!fullOrg) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // 現在のユーザーのメンバー情報を探す
    const currentUserMember = fullOrg.members.find(
      (m) => m.userId === session.user.id
    );

    if (!currentUserMember) {
      return NextResponse.json(
        { error: "Not a member of this organization" },
        { status: 403 }
      );
    }

    // チームメンバー一覧を取得
    const members = await getTeamMembers(teamId);

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Failed to get team members:", error);
    return NextResponse.json(
      { error: "Failed to get team members" },
      { status: 500 }
    );
  }
}
