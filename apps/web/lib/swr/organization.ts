import useSWR, { SWRConfiguration } from "swr";
import { fetcher } from "@workspace/utils";
import type {
  OrganizationInvitationsSuccessResponse,
  OrganizationMembersSuccessResponse,
  OrganizationNameSuccessResponse,
  OrganizationsWithUserRoleSuccessResponse,
  CurrentUserOrganizationInfoSuccessResponse,
  OrganizationsSuccessResponse,
} from "@/lib/types/organization";

export const useOrganizationName = (
  organizationId: string | null,
  swrOptions?: SWRConfiguration
) => {
  // Route ハンドラーの成功レスポンス型と一致
  const { data, error, isLoading, isValidating } =
    useSWR<OrganizationNameSuccessResponse>(
      organizationId ? `/api/organization/${organizationId}` : null,
      fetcher,
      {
        dedupingInterval: 60000, // 60秒間キャッシュ
        revalidateOnFocus: false, // フォーカス時の再検証無効
        ...swrOptions,
      }
    );

  return {
    organizationName: data?.name,
    isLoading,
    isValidating,
    error,
  };
};

export const useOrganizationMembers = (
  organizationId: string | null,
  swrOptions?: SWRConfiguration
) => {
  // Route ハンドラーの成功レスポンス型と一致
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<OrganizationMembersSuccessResponse>(
      organizationId ? `/api/organization/${organizationId}/members` : null,
      fetcher,
      {
        dedupingInterval: 60000, // 60秒間キャッシュ
        revalidateOnFocus: false, // フォーカス時の再検証無効
        keepPreviousData: true, // ページ遷移時のUX改善
        ...swrOptions,
      }
    );

  return {
    organizationMembers: data?.organizationMembers,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export const useOrganizationInvitations = (
  organizationId: string | null,
  swrOptions?: SWRConfiguration
) => {
  // Route ハンドラーの成功レスポンス型と一致
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<OrganizationInvitationsSuccessResponse>(
      organizationId ? `/api/organization/${organizationId}/invitations` : null,
      fetcher,
      {
        dedupingInterval: 60000, // 60秒間キャッシュ
        revalidateOnFocus: false, // フォーカス時の再検証無効
        ...swrOptions,
      }
    );

  return {
    invitations: data?.organizationInvitations,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export const useOrganizations = (swrOptions?: SWRConfiguration) => {
  // Route ハンドラーの成功レスポンス型と一致
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<OrganizationsSuccessResponse>("/api/organization", fetcher, {
      dedupingInterval: 60000, // 60秒間キャッシュ
      revalidateOnFocus: false, // フォーカス時の再検証無効
      ...swrOptions,
    });

  return {
    organizations: data?.organizations,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export const useOrganizationsWithUserRole = (swrOptions?: SWRConfiguration) => {
  // Route ハンドラーの成功レスポンス型と一致
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<OrganizationsWithUserRoleSuccessResponse>(
      "/api/organization/user-role",
      fetcher,
      {
        dedupingInterval: 60000, // 60秒間キャッシュ
        revalidateOnFocus: false, // フォーカス時の再検証無効
        ...swrOptions,
      }
    );

  return {
    organizations: data?.organizations,
    activeOrgId: data?.activeOrgId,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export const useCurrentUserOrganizationInfo = (
  organizationId: string | null,
  swrOptions?: SWRConfiguration
) => {
  // Route ハンドラーの成功レスポンス型と一致
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<CurrentUserOrganizationInfoSuccessResponse>(
      organizationId
        ? `/api/organization/${organizationId}/current-user`
        : null,
      fetcher,
      {
        dedupingInterval: 60000, // 60秒間キャッシュ
        revalidateOnFocus: false, // フォーカス時の再検証無効
        ...swrOptions,
      }
    );

  return {
    currentUserInfo: data?.data,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};
