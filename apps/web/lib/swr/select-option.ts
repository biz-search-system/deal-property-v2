import useSWR, { type SWRConfiguration } from "swr";
import { fetcher } from "@workspace/utils";
import type { SelectOptionsSuccessResponse } from "@/lib/types/select-option";
import type { SelectOptionCategory } from "@workspace/drizzle/schemas";

export const useSelectOptions = (
  category: SelectOptionCategory,
  swrOptions?: SWRConfiguration
) => {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<SelectOptionsSuccessResponse>(
      `/api/select-options?category=${category}`,
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
