import type { getProperties, getPropertyById } from "@/lib/data/property";

export type PropertyWithRelations = Awaited<
  ReturnType<typeof getProperties>
>[number];
export type PropertyDetail = Awaited<ReturnType<typeof getPropertyById>>;

// エラーレスポンス（共通）
export interface ErrorResponse {
  error: {
    message: string;
  };
}

// 成功レスポンス
export interface PropertyDetailSuccessResponse {
  property: NonNullable<PropertyDetail>;
}

// Union型で定義
export type PropertyDetailResponse =
  | PropertyDetailSuccessResponse
  | ErrorResponse;
