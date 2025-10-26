import { getOrganizationTeamsWithMemberCount, getTeamMembers } from "@/lib/data/team";
import { z } from "zod";
import {
  createTeamSchema,
  updateTeamSchema,
  addTeamMemberSchema,
  removeTeamMemberSchema
} from "@/lib/zod/schemas/team";

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
export type OrganizationTeamsResponse = {
  teams?: Awaited<ReturnType<typeof getOrganizationTeamsWithMemberCount>>;
  error?: string;
};

export type TeamMembersResponse = {
  members?: Awaited<ReturnType<typeof getTeamMembers>>;
  error?: string;
};

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