import useSWR from "swr";
import { fetcher } from "./fetcher";
import type {
  OrganizationInvitationsResponse,
  OrganizationMembersResponse,
  OrganizationNameResponse,
  OrganizationsWithUserRoleResponse,
} from "@/lib/types/organization";

export const useOrganizationName = (organizationId: string | null) => {
  const { data, error, isLoading } = useSWR<OrganizationNameResponse>(
    organizationId ? `/api/organization/${organizationId}` : null,
    fetcher
  );

  return {
    organization: data,
    isLoading,
    error,
  };
};

export const useOrganizationMembers = (organizationId: string | null) => {
  const { data, error, isLoading, mutate } =
    useSWR<OrganizationMembersResponse>(
      organizationId ? `/api/organization/${organizationId}/members` : null,
      fetcher
    );

  return {
    data: data?.organizationMembers,
    isLoading,
    error,
    mutate,
  };
};

export const useOrganizationInvitations = (organizationId: string | null) => {
  const { data, error, isLoading, mutate } =
    useSWR<OrganizationInvitationsResponse>(
      organizationId ? `/api/organization/${organizationId}/invitations` : null,
      fetcher
    );

  return {
    data: data?.organizationInvitations,
    isLoading,
    error,
    mutate,
  };
};

export const useOrganizationsWithUserRole = () => {
  const { data, error, isLoading, mutate } =
    useSWR<OrganizationsWithUserRoleResponse>("/api/organization", fetcher);

  return {
    organizations: data?.organizations,
    activeOrgId: data?.activeOrgId,
    isLoading,
    error,
    mutate,
  };
};
