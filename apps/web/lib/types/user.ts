import { verifySession } from "@/lib/data/sesstion";

export type VerifiedSession = Awaited<ReturnType<typeof verifySession>>;

// 成功レスポンス
export interface VerifiedSessionSuccessResponse {
  verifiedSession: VerifiedSession;
}

// エラーレスポンス
export interface ErrorResponse {
  error: {
    message: string;
  };
}

// Union型で定義
export type VerifiedSessionResponse =
  | VerifiedSessionSuccessResponse
  | ErrorResponse;
