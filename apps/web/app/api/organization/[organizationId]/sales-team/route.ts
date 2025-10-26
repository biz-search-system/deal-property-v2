import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { getSalesTeamMembers } from "@/lib/data/organization";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/organization/[organizationId]/sales-team">
): Promise<NextResponse> {
  const { organizationId } = await ctx.params;

  // セッション確認
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 営業チームメンバーを取得
    const members = await getSalesTeamMembers(organizationId);

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Failed to get sales team members:", error);
    return NextResponse.json(
      { error: "Failed to get sales team members" },
      { status: 500 }
    );
  }
}