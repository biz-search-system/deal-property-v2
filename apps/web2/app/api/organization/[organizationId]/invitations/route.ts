import { auth } from "@/lib/auth";
import { getOrganizationInvitations } from "@/lib/data/organization";
import { OrganizationInvitationsResponse } from "@/lib/types/organization";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/organization/[organizationId]/invitations">
): Promise<NextResponse<OrganizationInvitationsResponse>> {
  const { organizationId } = await ctx.params;

  // セッション確認
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 招待状一覧を取得
    const data = await getOrganizationInvitations(organizationId);

    return NextResponse.json({ organizationInvitations: data });
  } catch (error) {
    console.error("Failed to get invitations:", error);
    return NextResponse.json(
      { error: "Failed to get invitations" },
      { status: 500 }
    );
  }
}
