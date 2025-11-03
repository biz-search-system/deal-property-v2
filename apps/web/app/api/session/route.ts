import { verifySession } from "@/lib/data/sesstion";
import { VerifiedSessionResponse } from "@/lib/types/user";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<VerifiedSessionResponse>> {
  // セッション確認
  const data = await verifySession();

  if (!data) {
    return NextResponse.json(
      { error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }

  try {
    return NextResponse.json({ verifiedSession: data });
  } catch (error) {
    console.error("Failed to get session:", error);
    return NextResponse.json(
      { error: { message: "Failed to get session" } },
      { status: 500 }
    );
  }
}
