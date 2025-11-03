import useSWR from "swr";
import {
  OrganizationTeamsSuccessResponse,
  TeamMembersSuccessResponse,
} from "@/lib/types/team";
import { fetcher } from "@workspace/utils";

/**
 * 組織のチーム一覧を取得するフック
 */
export const useOrganizationTeams = (organizationId: string | null) => {
  // Route ハンドラーの成功レスポンス型と一致
  const { data, error, isLoading, mutate } =
    useSWR<OrganizationTeamsSuccessResponse>(
      organizationId ? `/api/organization/${organizationId}/teams` : null,
      fetcher
    );

  return {
    teams: data?.teams,
    isLoading,
    error,
    mutate,
  };
};

/**
 * チームメンバー一覧を取得するフック
 */
export const useTeamMembers = (teamId: string | null) => {
  // Route ハンドラーの成功レスポンス型と一致
  const { data, error, isLoading, mutate } = useSWR<TeamMembersSuccessResponse>(
    teamId ? `/api/team/${teamId}/members` : null,
    fetcher
  );

  return {
    members: data?.members,
    isLoading,
    error,
    mutate,
  };
};