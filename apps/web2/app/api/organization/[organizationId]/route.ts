import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { OrganizationNameResponse } from "@/lib/types/organization";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/organization/[organizationId]">
): Promise<NextResponse<OrganizationNameResponse>> {
  const { organizationId } = await context.params;

  // セッション確認
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 組織情報を取得
    const organization = await auth.api.getFullOrganization({
      query: { organizationId },
      headers: await headers(),
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // ユーザーがこの組織のメンバーかチェック
    const isMember = organization.members.some(
      (m) => m.userId === session.user.id
    );

    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      name: organization.name,
    });
  } catch (error) {
    console.error("Failed to fetch organization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
