import useSWR from "swr";
import { fetcher } from "@workspace/utils";
import type { VerifiedSessionSuccessResponse } from "@/lib/types/user";

export const useSession = () => {
  // Route ハンドラーの成功レスポンス型と一致
  const { data, error, isLoading, mutate } = useSWR<VerifiedSessionSuccessResponse>(
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
