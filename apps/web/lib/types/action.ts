/**
 * Server Actionの共通戻り値型
 * 本番環境でもカスタムエラーメッセージをクライアントに返すために使用
 */
export type ActionResult =
  | { success: true }
  | { success: false; error: string };
