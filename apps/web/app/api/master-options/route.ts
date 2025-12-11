import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@workspace/drizzle/db";
import { masterOptions } from "@workspace/drizzle/schemas";
import { and, eq, isNull, or } from "drizzle-orm";
import { auth } from "@workspace/auth";
import { headers } from "next/headers";
import { verifySession } from "@/lib/data/sesstion";

export async function GET(req: NextRequest) {
  await verifySession();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const organizationId = searchParams.get("organizationId");

  if (!category) {
    return NextResponse.json(
      { error: { message: "Category is required" } },
      { status: 400 }
    );
  }

  try {
    // 組織固有 + グローバル（organizationId が null）のオプションを取得
    const options = await db.query.masterOptions.findMany({
      where: and(
        eq(masterOptions.category, category),
        or(
          organizationId
            ? eq(masterOptions.organizationId, organizationId)
            : undefined,
          isNull(masterOptions.organizationId)
        )
      ),
      orderBy: (options, { asc }) => [asc(options.value)],
    });

    return NextResponse.json({ options });
  } catch (error) {
    console.error("Failed to fetch master options:", error);
    return NextResponse.json(
      { error: { message: "Failed to fetch master options" } },
      { status: 500 }
    );
  }
}
