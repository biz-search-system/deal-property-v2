import type { selectOptions } from "@workspace/drizzle/schemas";

export type SelectOption = typeof selectOptions.$inferSelect;

// エラーレスポンス（共通）
export interface ErrorResponse {
  error: {
    message: string;
  };
}

// 成功レスポンス
export interface SelectOptionsSuccessResponse {
  options: SelectOption[];
}

// Union型で定義
export type SelectOptionsResponse =
  | SelectOptionsSuccessResponse
  | ErrorResponse;
