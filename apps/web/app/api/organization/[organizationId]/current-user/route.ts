import { NextRequest, NextResponse } from "next/server";
import { auth } from "@workspace/auth";
import { headers } from "next/headers";
import { getCurrentUserOrganizationInfo } from "@/lib/data/organization";
import { CurrentUserOrganizationInfoResponse } from "@/lib/types/organization";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/organization/[organizationId]/current-user">
): Promise<NextResponse<CurrentUserOrganizationInfoResponse>> {
  const { organizationId } = await ctx.params;

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
    const data = await getCurrentUserOrganizationInfo(organizationId);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Failed to get current user organization info:", error);

    if (error instanceof Error) {
      if (error.message === "Not a member of this organization") {
        return NextResponse.json(
          { error: { message: error.message } },
          { status: 403 }
        );
      }
      if (error.message === "Organization not found") {
        return NextResponse.json(
          { error: { message: error.message } },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: { message: "Failed to get user information" } },
      { status: 500 }
    );
  }
}
