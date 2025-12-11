import useSWR, { type SWRConfiguration } from "swr";
import { fetcher } from "@workspace/utils";
import type { MasterOptionsSuccessResponse } from "@/lib/types/master-option";
import type { MasterOptionCategory } from "@workspace/drizzle/schemas";

export const useMasterOptions = (
  category: MasterOptionCategory,
  organizationId?: string | null,
  swrOptions?: SWRConfiguration
) => {
  const params = new URLSearchParams({ category });
  if (organizationId) {
    params.append("organizationId", organizationId);
  }

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<MasterOptionsSuccessResponse>(
      `/api/master-options?${params.toString()}`,
      fetcher,
      {
        dedupingInterval: 60000, // 60秒間キャッシュ
        revalidateOnFocus: false,
        ...swrOptions,
      }
    );

  return {
    options: data?.options ?? [],
    isLoading,
    isValidating,
    error,
    mutate,
  };
};
