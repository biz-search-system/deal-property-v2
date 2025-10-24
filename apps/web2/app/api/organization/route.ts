import { auth } from "@/lib/auth";
import { getOrganizationsWithUserRole } from "@/lib/data/organization";
import { OrganizationsWithUserRoleResponse } from "@/lib/types/organization";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
  _req: NextRequest
): Promise<NextResponse<OrganizationsWithUserRoleResponse>> {
  // セッション確認
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ユーザーIDを取得
    const userId = session.user.id;
    const activeOrgId = session.session.activeOrganizationId;

    // 組織一覧を取得
    const organizations = await getOrganizationsWithUserRole(userId);

    return NextResponse.json({
      organizations,
      activeOrgId: activeOrgId || null,
    });
  } catch (error) {
    console.error("Failed to get organizations:", error);
    return NextResponse.json(
      { error: "Failed to get organizations" },
      { status: 500 }
    );
  }
}
