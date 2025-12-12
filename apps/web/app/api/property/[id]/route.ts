import { NextRequest, NextResponse } from "next/server";
import { auth } from "@workspace/auth";
import { headers } from "next/headers";
import { getPropertyById } from "@/lib/data/property";
import type { PropertyDetailResponse } from "@/lib/types/property";
import { verifySession } from "@/lib/data/sesstion";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/property/[id]">
): Promise<NextResponse<PropertyDetailResponse>> {
  const { id } = await ctx.params;

  // セッション確認
  const session = await verifySession();

  if (!session) {
    return NextResponse.json(
      { error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }

  try {
    const property = await getPropertyById(id);

    if (!property) {
      return NextResponse.json(
        { error: { message: "Property not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ property });
  } catch (error) {
    console.error("Failed to get property:", error);
    return NextResponse.json(
      { error: { message: "Failed to get property" } },
      { status: 500 }
    );
  }
}
