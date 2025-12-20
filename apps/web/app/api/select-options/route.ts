import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@workspace/drizzle/db";
import { selectOptions } from "@workspace/drizzle/schemas";
import { eq } from "drizzle-orm";
import { verifySession } from "@/lib/data/sesstion";

export async function GET(req: NextRequest) {
  await verifySession();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  if (!category) {
    return NextResponse.json(
      { error: { message: "Category is required" } },
      { status: 400 }
    );
  }

  try {
    // カテゴリでフィルタリングしてオプションを取得（全組織共通）
    const options = await db.query.selectOptions.findMany({
      where: eq(selectOptions.category, category),
      orderBy: (options, { asc }) => [asc(options.value)],
    });

    return NextResponse.json({ options });
  } catch (error) {
    console.error("Failed to fetch select options:", error);
    return NextResponse.json(
      { error: { message: "Failed to fetch select options" } },
      { status: 500 }
    );
  }
}
