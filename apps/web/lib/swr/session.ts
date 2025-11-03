import useSWRImmutable from "swr/immutable";
import { fetcher } from "@workspace/utils";
import type { VerifiedSessionSuccessResponse } from "@/lib/types/user";

export const useSession = () => {
  // Route ハンドラーの成功レスポンス型と一致
  // useSWRImmutableを使用（セッション情報は不変なため再検証不要）
  const { data, error, isLoading, mutate } = useSWRImmutable<VerifiedSessionSuccessResponse>(
    "/api/session",
    fetcher
  );

  return {
    session: data?.verifiedSession?.session,
    user: data?.verifiedSession?.user,
    isLoading,
    error,
    mutate,
  };
};
