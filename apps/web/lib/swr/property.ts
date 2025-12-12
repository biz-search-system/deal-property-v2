import useSWR, { SWRConfiguration } from "swr";
import { fetcher } from "@workspace/utils";
import type { PropertyDetailSuccessResponse } from "@/lib/types/property";

/**
 * プロパティ詳細を取得するフック
 */
export const usePropertyDetail = (
  propertyId: string | null,
  swrOptions?: SWRConfiguration
) => {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<PropertyDetailSuccessResponse>(
      propertyId ? `/api/property/${propertyId}` : null,
      fetcher,
      {
        dedupingInterval: 5000, // 5秒キャッシュ
        revalidateOnFocus: true, // タブにフォーカス時に再取得
        revalidateOnReconnect: true, // ネットワーク再接続時
        keepPreviousData: true,
        ...swrOptions,
      }
    );

  return {
    property: data?.property,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};
