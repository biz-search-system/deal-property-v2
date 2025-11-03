import useSWR from "swr";
import { fetcher } from "@workspace/utils";
import type {
  OrganizationInvitationsSuccessResponse,
  OrganizationMembersSuccessResponse,
  OrganizationNameSuccessResponse,
  OrganizationsWithUserRoleSuccessResponse,
  CurrentUserOrganizationInfoSuccessResponse,
} from "@/lib/types/organization";

export const useOrganizationName = (organizationId: string | null) => {
  // Route ハンドラーの成功レスポンス型と一致
  const { data, error, isLoading } = useSWR<OrganizationNameSuccessResponse>(
    organizationId ? `/api/organization/${organizationId}` : null,
    fetcher
  );

  return {
    name: data?.name,
    isLoading,
    error,
  };
};

export const useOrganizationMembers = (organizationId: string | null) => {
  // Route ハンドラーの成功レスポンス型と一致
  const { data, error, isLoading, mutate } =
    useSWR<OrganizationMembersSuccessResponse>(
      organizationId ? `/api/organization/${organizationId}/members` : null,
      fetcher
    );

  return {
    members: data?.organizationMembers,
    isLoading,
    error,
    mutate,
  };
};

export const useOrganizationInvitations = (organizationId: string | null) => {
  // Route ハンドラーの成功レスポンス型と一致
  const { data, error, isLoading, mutate } =
    useSWR<OrganizationInvitationsSuccessResponse>(
      organizationId ? `/api/organization/${organizationId}/invitations` : null,
      fetcher
    );

  return {
    invitations: data?.organizationInvitations,
    isLoading,
    error,
    mutate,
  };
};

export const useOrganizationsWithUserRole = () => {
  // Route ハンドラーの成功レスポンス型と一致
  const { data, error, isLoading, mutate } =
    useSWR<OrganizationsWithUserRoleSuccessResponse>("/api/organization", fetcher);

  return {
    organizations: data?.organizations,
    activeOrgId: data?.activeOrgId,
    isLoading,
    error,
    mutate,
  };
};

export const useCurrentUserOrganizationInfo = (organizationId: string | null) => {
  // Route ハンドラーの成功レスポンス型と一致
  const { data, error, isLoading, mutate } =
    useSWR<CurrentUserOrganizationInfoSuccessResponse>(
      organizationId ? `/api/organization/${organizationId}/current-user` : null,
      fetcher
    );

  return {
    info: data?.data,
    isLoading,
    error,
    mutate,
  };
};
