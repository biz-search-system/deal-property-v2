import { auth } from "@/lib/auth";
import { getOrganizationMembers } from "@/lib/data/organization";
import { OrganizationMembersResponse } from "@/lib/types/organization";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/organization/[organizationId]/members">
): Promise<NextResponse<OrganizationMembersResponse>> {
  const { organizationId } = await ctx.params;

  // セッション確認
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // メンバー一覧を取得
    const data = await getOrganizationMembers(organizationId);

    return NextResponse.json({ organizationMembers: data });
  } catch (error) {
    console.error("Failed to get organization members:", error);
    return NextResponse.json(
      { error: "Failed to get organization members" },
      { status: 500 }
    );
  }
}
