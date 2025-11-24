import { NextRequest, NextResponse } from "next/server";
import { getBankAccountDailyTotal } from "@/lib/data/bank-account";
import { verifySession } from "@/lib/data/sesstion";
import { bankAccountSchema } from "@/lib/zod/schemas/bank-account";
import { z } from "zod";

// エラーレスポンスの型
interface ErrorResponse {
  error: {
    message: string;
  };
}

// 成功レスポンスの型
interface SuccessResponse {
  total: number;
  count: number;
}

type BankAccountTotalResponse = SuccessResponse | ErrorResponse;

export async function GET(
  req: NextRequest,
): Promise<NextResponse<BankAccountTotalResponse>> {
  try {
    // セッション認証
    await verifySession();

    const searchParams = req.nextUrl.searchParams;
    const dateStr = searchParams.get("date");
    const company = searchParams.get("company");
    const account = searchParams.get("account");
    const excludeId = searchParams.get("excludeId");

    if (!dateStr || !company || !account) {
      return NextResponse.json(
        {
          error: {
            message: "必須パラメータが不足しています",
          },
        },
        { status: 400 },
      );
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        {
          error: {
            message: "無効な日付形式です",
          },
        },
        { status: 400 },
      );
    }

    // Zodスキーマでバリデーション
    const validationResult = bankAccountSchema.safeParse({
      accountCompany: company,
      bankAccount: account,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        {
          error: {
            message: firstError?.message || "無効なパラメータです",
          },
        },
        { status: 400 },
      );
    }

    // データレイヤーの関数を直接呼び出す
    const result = await getBankAccountDailyTotal({
      date,
      accountCompany: validationResult.data.accountCompany,
      bankAccount: validationResult.data.bankAccount,
      excludePropertyId: excludeId || undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to get bank account total:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        {
          error: {
            message: "認証が必要です",
          },
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        error: {
          message: "口座合計金額の取得に失敗しました",
        },
      },
      { status: 500 },
    );
  }
}
