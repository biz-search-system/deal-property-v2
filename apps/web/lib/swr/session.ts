import useSWRImmutable from "swr/immutable";
// import useSWR from "swr";
import { fetcher } from "@workspace/utils";
import type { VerifiedSessionSuccessResponse } from "@/lib/types/user";
import { authClient } from "@workspace/auth/client";

export const useSession = () => {
  // Route ハンドラーの成功レスポンス型と一致
  // useSWRImmutableを使用（セッション情報は不変なため再検証不要）
  // const { data, error, isLoading, mutate } =
  //   useSWRImmutable<VerifiedSessionSuccessResponse>("/api/session", fetcher);
  // // useSWR<VerifiedSessionSuccessResponse>("/api/session", fetcher);
  // return {
  //   session: data?.verifiedSession?.session,
  //   user: data?.verifiedSession?.user,
  //   isLoading,
  //   error,
  //   mutate,
  // };
  const { data, error, isPending } = authClient.useSession();
  return {
    session: data?.session,
    user: data?.user,
    isPending,
  };
};
