"use server";

import { auth } from "@workspace/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@workspace/drizzle/db";
import { teams } from "@workspace/drizzle/schemas";
import { eq } from "drizzle-orm";
import {
  createTeamSchema,
  updateTeamSchema,
  addTeamMemberSchema,
  removeTeamMemberSchema,
} from "@/lib/zod/schemas/team";
import type {
  CreateTeamInput,
  UpdateTeamInput,
  AddTeamMemberInput,
  RemoveTeamMemberInput,
} from "@/lib/types/team";

/**
 * チームを作成する
 */
export async function createTeamAction(data: CreateTeamInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("認証が必要です");
  }

  // バリデーション
  const validatedData = createTeamSchema.parse(data);

  // 組織の詳細情報を取得してメンバーか確認
  const fullOrg = await auth.api.getFullOrganization({
    query: { organizationId: validatedData.organizationId },
    headers: await headers(),
  });

  if (!fullOrg) {
    throw new Error("組織が見つかりません");
  }

  // 現在のユーザーのメンバー情報を探す
  const currentUserMember = fullOrg.members.find(
    (m) => m.userId === session.user.id,
  );

  if (!currentUserMember) {
    throw new Error("この組織のメンバーではありません");
  }

  // 権限確認（adminまたはownerのみ）
  if (
    currentUserMember.role !== "admin" &&
    currentUserMember.role !== "owner"
  ) {
    throw new Error("チーム作成権限がありません");
  }

  // チームを作成
  const result = await auth.api.createTeam({
    body: {
      name: validatedData.name,
      organizationId: validatedData.organizationId,
    },
    headers: await headers(),
  });

  if (!result) {
    throw new Error("チームの作成に失敗しました");
  }

  // 画面を更新
  revalidatePath(`/organization/${validatedData.organizationId}`);

  return result;
}

/**
 * チーム名を更新する
 */
export async function updateTeamAction(data: UpdateTeamInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("認証が必要です");
  }

  // バリデーション
  const validatedData = updateTeamSchema.parse(data);

  // チーム情報を取得して権限確認
  const team = await db.query.teams.findFirst({
    where: eq(teams.id, validatedData.teamId),
  });

  if (!team) {
    throw new Error("チームが見つかりません");
  }

  // 組織の詳細情報を取得してメンバーか確認
  const fullOrg = await auth.api.getFullOrganization({
    query: { organizationId: team.organizationId },
    headers: await headers(),
  });

  if (!fullOrg) {
    throw new Error("組織が見つかりません");
  }

  // 現在のユーザーのメンバー情報を探す
  const currentUserMember = fullOrg.members.find(
    (m) => m.userId === session.user.id,
  );

  if (!currentUserMember) {
    throw new Error("この組織のメンバーではありません");
  }

  // 権限確認（adminまたはownerのみ）
  if (
    currentUserMember.role !== "admin" &&
    currentUserMember.role !== "owner"
  ) {
    throw new Error("チーム編集権限がありません");
  }

  // チームを更新
  const result = await auth.api.updateTeam({
    body: {
      teamId: validatedData.teamId,
      data: {
        name: validatedData.name,
      },
    },
    headers: await headers(),
  });

  if (!result) {
    throw new Error("チームの更新に失敗しました");
  }

  // 画面を更新
  revalidatePath(`/organization/${team.organizationId}`);

  return result;
}

/**
 * チームを削除する
 */
export async function deleteTeamAction(teamId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("認証が必要です");
  }

  // チーム情報を取得して権限確認
  const team = await db.query.teams.findFirst({
    where: eq(teams.id, teamId),
  });

  if (!team) {
    throw new Error("チームが見つかりません");
  }

  // 組織の詳細情報を取得してメンバーか確認
  const fullOrg = await auth.api.getFullOrganization({
    query: { organizationId: team.organizationId },
    headers: await headers(),
  });

  if (!fullOrg) {
    throw new Error("組織が見つかりません");
  }

  // 現在のユーザーのメンバー情報を探す
  const currentUserMember = fullOrg.members.find(
    (m) => m.userId === session.user.id,
  );

  if (!currentUserMember) {
    throw new Error("この組織のメンバーではありません");
  }

  // 権限確認（adminまたはownerのみ）
  if (
    currentUserMember.role !== "admin" &&
    currentUserMember.role !== "owner"
  ) {
    throw new Error("チーム削除権限がありません");
  }

  // チームを削除
  const result = await auth.api.removeTeam({
    body: {
      teamId,
      organizationId: team.organizationId,
    },
    headers: await headers(),
  });

  if (!result) {
    throw new Error("チームの削除に失敗しました");
  }

  // 画面を更新
  revalidatePath(`/organization/${team.organizationId}`);

  return true;
}

/**
 * チームにメンバーを追加する
 */
export async function addTeamMemberAction(data: AddTeamMemberInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("認証が必要です");
  }

  // バリデーション
  const validatedData = addTeamMemberSchema.parse(data);

  // チーム情報を取得して権限確認
  const team = await db.query.teams.findFirst({
    where: eq(teams.id, validatedData.teamId),
  });

  if (!team) {
    throw new Error("チームが見つかりません");
  }

  // 組織の詳細情報を取得してメンバーか確認
  const fullOrg = await auth.api.getFullOrganization({
    query: { organizationId: team.organizationId },
    headers: await headers(),
  });

  if (!fullOrg) {
    throw new Error("組織が見つかりません");
  }

  // 現在のユーザーのメンバー情報を探す
  const currentUserMember = fullOrg.members.find(
    (m) => m.userId === session.user.id,
  );

  if (!currentUserMember) {
    throw new Error("この組織のメンバーではありません");
  }

  // 権限確認（adminまたはownerのみ）
  if (
    currentUserMember.role !== "admin" &&
    currentUserMember.role !== "owner"
  ) {
    throw new Error("メンバー追加権限がありません");
  }

  // 追加するユーザーが組織のメンバーか確認
  const targetUserMember = fullOrg.members.find(
    (m) => m.userId === validatedData.userId,
  );

  if (!targetUserMember) {
    throw new Error("追加するユーザーは組織のメンバーではありません");
  }

  // チームにメンバーを追加
  const result = await auth.api.addTeamMember({
    body: {
      teamId: validatedData.teamId,
      userId: validatedData.userId,
    },
    headers: await headers(),
  });

  if (!result) {
    throw new Error("メンバーの追加に失敗しました");
  }

  // 画面を更新
  revalidatePath(`/organization/${team.organizationId}`);

  return result;
}

/**
 * チームからメンバーを削除する
 */
export async function removeTeamMemberAction(data: RemoveTeamMemberInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("認証が必要です");
  }

  // バリデーション
  const validatedData = removeTeamMemberSchema.parse(data);

  // チーム情報を取得して権限確認
  const team = await db.query.teams.findFirst({
    where: eq(teams.id, validatedData.teamId),
  });

  if (!team) {
    throw new Error("チームが見つかりません");
  }

  // 組織の詳細情報を取得してメンバーか確認
  const fullOrg = await auth.api.getFullOrganization({
    query: { organizationId: team.organizationId },
    headers: await headers(),
  });

  if (!fullOrg) {
    throw new Error("組織が見つかりません");
  }

  // 現在のユーザーのメンバー情報を探す
  const currentUserMember = fullOrg.members.find(
    (m) => m.userId === session.user.id,
  );

  if (!currentUserMember) {
    throw new Error("この組織のメンバーではありません");
  }

  // 権限確認（adminまたはownerのみ）
  if (
    currentUserMember.role !== "admin" &&
    currentUserMember.role !== "owner"
  ) {
    throw new Error("メンバー削除権限がありません");
  }

  // チームからメンバーを削除
  const result = await auth.api.removeTeamMember({
    body: {
      teamId: validatedData.teamId,
      userId: validatedData.userId,
    },
    headers: await headers(),
  });

  if (!result) {
    throw new Error("メンバーの削除に失敗しました");
  }

  // 画面を更新
  revalidatePath(`/organization/${team.organizationId}`);

  return true;
}
