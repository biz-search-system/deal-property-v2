import type { masterOptions } from "@workspace/drizzle/schemas";

export type MasterOption = typeof masterOptions.$inferSelect;

// エラーレスポンス（共通）
export interface ErrorResponse {
  error: {
    message: string;
  };
}

// 成功レスポンス
export interface MasterOptionsSuccessResponse {
  options: MasterOption[];
}

// Union型で定義
export type MasterOptionsResponse =
  | MasterOptionsSuccessResponse
  | ErrorResponse;
