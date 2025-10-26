import useSWR from "swr";
import { OrganizationTeamsResponse, TeamMembersResponse } from "@/lib/types/team";
import { fetcher } from "./fetcher";

/**
 * 組織のチーム一覧を取得するフック
 */
export const useOrganizationTeams = (organizationId: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<OrganizationTeamsResponse>(
    organizationId ? `/api/organization/${organizationId}/teams` : null,
    fetcher
  );

  return {
    teams: data?.teams,
    isLoading,
    error: error || data?.error,
    mutate,
  };
};

/**
 * チームメンバー一覧を取得するフック
 */
export const useTeamMembers = (teamId: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<TeamMembersResponse>(
    teamId ? `/api/team/${teamId}/members` : null,
    fetcher
  );

  return {
    members: data?.members,
    isLoading,
    error: error || data?.error,
    mutate,
  };
};