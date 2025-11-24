import { NextRequest, NextResponse } from "next/server";
import { auth } from "@workspace/auth";
import { headers } from "next/headers";
import { getOrganizationTeamsWithMemberCount } from "@/lib/data/team";
import { OrganizationTeamsResponse } from "@/lib/types/team";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/organization/[organizationId]/teams">,
): Promise<NextResponse<OrganizationTeamsResponse>> {
  const { organizationId } = await ctx.params;

  // セッション確認
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: { message: "Unauthorized" } },
      { status: 401 },
    );
  }

  try {
    // 組織の詳細情報を取得してメンバーか確認
    const fullOrg = await auth.api.getFullOrganization({
      query: { organizationId },
      headers: await headers(),
    });

    if (!fullOrg) {
      return NextResponse.json(
        { error: { message: "Organization not found" } },
        { status: 404 },
      );
    }

    // 現在のユーザーのメンバー情報を探す
    const currentUserMember = fullOrg.members.find(
      (m) => m.userId === session.user.id,
    );

    if (!currentUserMember) {
      return NextResponse.json(
        { error: { message: "Not a member of this organization" } },
        { status: 403 },
      );
    }

    // チーム一覧を取得（メンバー数付き）
    const teams = await getOrganizationTeamsWithMemberCount(organizationId);

    return NextResponse.json({ teams });
  } catch (error) {
    console.error("Failed to get organization teams:", error);
    return NextResponse.json(
      { error: { message: "Failed to get organization teams" } },
      { status: 500 },
    );
  }
}
