import useSWR, { SWRConfiguration } from "swr";
import {
  OrganizationTeamsSuccessResponse,
  TeamMembersSuccessResponse,
  SalesTeamMembersSuccessResponse,
} from "@/lib/types/team";
import { fetcher } from "@workspace/utils";

/**
 * 組織のチーム一覧を取得するフック
 */
export const useOrganizationTeams = (
  organizationId: string | null,
  swrOptions?: SWRConfiguration,
) => {
  // Route ハンドラーの成功レスポンス型と一致
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<OrganizationTeamsSuccessResponse>(
      organizationId ? `/api/organization/${organizationId}/teams` : null,
      fetcher,
      {
        dedupingInterval: 60000, // 60秒間キャッシュ
        revalidateOnFocus: false, // フォーカス時の再検証無効
        ...swrOptions,
      },
    );

  return {
    teams: data?.teams,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

/**
 * チームメンバー一覧を取得するフック
 */
export const useTeamMembers = (
  teamId: string | null,
  swrOptions?: SWRConfiguration,
) => {
  // Route ハンドラーの成功レスポンス型と一致
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<TeamMembersSuccessResponse>(
      teamId ? `/api/team/${teamId}/members` : null,
      fetcher,
      {
        dedupingInterval: 60000, // 60秒間キャッシュ
        revalidateOnFocus: false, // フォーカス時の再検証無効
        keepPreviousData: true, // ページ遷移時のUX改善
        ...swrOptions,
      },
    );

  return {
    members: data?.members,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

/**
 * 営業チームメンバー一覧を取得するフック
 */
export const useSalesTeamMembers = (
  organizationId: string | null,
  swrOptions?: SWRConfiguration,
) => {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<SalesTeamMembersSuccessResponse>(
      organizationId
        ? `/api/organization/${organizationId}/sales-team`
        : null,
      fetcher,
      {
        dedupingInterval: 60000, // 60秒間キャッシュ
        revalidateOnFocus: false, // フォーカス時の再検証無効
        keepPreviousData: true, // ページ遷移時のUX改善
        ...swrOptions,
      },
    );

  return {
    members: data?.members,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};
