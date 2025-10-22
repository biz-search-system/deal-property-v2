import {
  getActiveOrganization,
  getOrganizationInvitations,
  getOrganizationMembers,
  getOrganizationsWithUserRole,
} from "@/lib/data/organization";

export type OrganizationWithUserRole = Awaited<
  ReturnType<typeof getOrganizationsWithUserRole>
>[number];

export type ActiveOrganization = Awaited<
  ReturnType<typeof getActiveOrganization>
>;

// API レスポンス型
export interface OrganizationNameResponse {
  name?: string;
  error?: string;
}

export type OrganizationMembers = Awaited<
  ReturnType<typeof getOrganizationMembers>
>;

export interface OrganizationMembersResponse {
  organizationMembers?: OrganizationMembers;
  error?: string;
}

export type OrganizationInvitations = Awaited<
  ReturnType<typeof getOrganizationInvitations>
>[number];

export interface OrganizationInvitationsResponse {
  organizationInvitations?: OrganizationInvitations[];
  error?: string;
}

export interface OrganizationsWithUserRoleResponse {
  organizations?: OrganizationWithUserRole[];
  activeOrgId?: string | null;
  error?: string;
}
