import { verifySession } from "@/lib/sesstion";
import { VerifiedSessionResponse } from "@/lib/types/user";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
  _req: NextRequest
): Promise<NextResponse<VerifiedSessionResponse>> {
  // セッション確認
  const data = await verifySession();

  if (!data) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json({ verifiedSession: data });
  } catch (error) {
    console.error("Failed to get session:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    );
  }
}
