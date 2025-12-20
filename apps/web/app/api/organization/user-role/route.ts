import {
  getOrganizations,
  getOrganizationsWithUserRole,
} from "@/lib/data/organization";
import {
  OrganizationsResponse,
  OrganizationsWithUserRoleResponse,
} from "@/lib/types/organization";
import { auth } from "@workspace/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(): Promise<
  NextResponse<OrganizationsWithUserRoleResponse>
> {
  // セッション確認
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: { message: "Unauthorized" } },
      { status: 401 }
    );
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
      { error: { message: "Failed to get organizations" } },
      { status: 500 }
    );
  }
}
