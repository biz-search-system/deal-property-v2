import {
  getOrganizationTeamsWithMemberCount,
  getTeamMembers,
} from "@/lib/data/team";
import { z } from "zod";
import {
  createTeamSchema,
  updateTeamSchema,
  addTeamMemberSchema,
  removeTeamMemberSchema,
} from "@/lib/zod/schemas/team";
import { getSalesTeamMembers } from "../data/organization";

// Drizzle schema から生成される型
export type Team = {
  id: string;
  name: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TeamMember = {
  id: string;
  teamId: string;
  userId: string;
  createdAt: Date;
  user?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
};

// API レスポンス型
export type OrganizationTeams = Awaited<
  ReturnType<typeof getOrganizationTeamsWithMemberCount>
>;
export type Member = Awaited<ReturnType<typeof getTeamMembers>>[number];
export type SalesTeamMember = Awaited<
  ReturnType<typeof getSalesTeamMembers>
>[number];

// エラーレスポンス（共通）
export interface ErrorResponse {
  error: {
    message: string;
  };
}

// 成功レスポンス
export interface OrganizationTeamsSuccessResponse {
  teams: OrganizationTeams;
}

export interface TeamMembersSuccessResponse {
  members: Member[];
}

// // 営業チームメンバー型
// export interface SalesTeamMember {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
// }

export interface SalesTeamMembersSuccessResponse {
  members: SalesTeamMember[];
}

// Union型で定義
export type OrganizationTeamsResponse =
  | OrganizationTeamsSuccessResponse
  | ErrorResponse;
export type TeamMembersResponse = TeamMembersSuccessResponse | ErrorResponse;

// UIで使用する拡張型
export type TeamWithMemberCount = Team & {
  memberCount: number;
};

export type TeamWithMembers = Team & {
  members: TeamMember[];
};

// Zodスキーマから生成される型
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type AddTeamMemberInput = z.infer<typeof addTeamMemberSchema>;
export type RemoveTeamMemberInput = z.infer<typeof removeTeamMemberSchema>;
