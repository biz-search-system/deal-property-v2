import {
  getOrganizations,
  getActiveOrganization,
  getOrganizationInvitations,
  getOrganizationMembers,
  getOrganizationsWithUserRole,
  getCurrentUserOrganizationInfo,
} from "@/lib/data/organization";

export type Organization = Awaited<ReturnType<typeof getOrganizations>>[number];

export type OrganizationWithUserRole = Awaited<
  ReturnType<typeof getOrganizationsWithUserRole>
>[number];

export type ActiveOrganization = Awaited<
  ReturnType<typeof getActiveOrganization>
>;

export type OrganizationMembers = Awaited<
  ReturnType<typeof getOrganizationMembers>
>;

export type OrganizationInvitations = Awaited<
  ReturnType<typeof getOrganizationInvitations>
>[number];

export type CurrentUserOrganizationInfo = Awaited<
  ReturnType<typeof getCurrentUserOrganizationInfo>
>;

// エラーレスポンス（共通）
export interface ErrorResponse {
  error: {
    message: string;
  };
}

// 成功レスポンス
export interface OrganizationNameSuccessResponse {
  name: string;
}

export interface OrganizationMembersSuccessResponse {
  organizationMembers: OrganizationMembers;
}

export interface OrganizationInvitationsSuccessResponse {
  organizationInvitations: OrganizationInvitations[];
}

export interface OrganizationsWithUserRoleSuccessResponse {
  organizations: OrganizationWithUserRole[];
  activeOrgId: string | null;
}

export interface CurrentUserOrganizationInfoSuccessResponse {
  data: CurrentUserOrganizationInfo;
}

// Union型で定義
export type OrganizationNameResponse =
  | OrganizationNameSuccessResponse
  | ErrorResponse;
export type OrganizationMembersResponse =
  | OrganizationMembersSuccessResponse
  | ErrorResponse;
export type OrganizationInvitationsResponse =
  | OrganizationInvitationsSuccessResponse
  | ErrorResponse;
export type OrganizationsWithUserRoleResponse =
  | OrganizationsWithUserRoleSuccessResponse
  | ErrorResponse;
export type CurrentUserOrganizationInfoResponse =
  | CurrentUserOrganizationInfoSuccessResponse
  | ErrorResponse;
