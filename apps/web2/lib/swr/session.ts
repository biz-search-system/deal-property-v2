import useSWR from "swr";
import { fetcher } from "./fetcher";
import type { VerifiedSessionResponse } from "@/lib/types/user";

export const useSession = () => {
  const { data, error, isLoading, mutate } = useSWR<VerifiedSessionResponse>(
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
