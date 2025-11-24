import "server-only";

import { headers } from "next/headers";
import { auth } from "../better-auth/auth";
import { db } from "@workspace/drizzle/db";
import { users } from "@workspace/drizzle/schemas";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ProfileUpdate } from "@workspace/drizzle/types";

/**
 * 現在のユーザー情報を取得
 * @returns ユーザー情報
 */
export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * ユーザー情報を更新
 * @param userId ユーザーID
 * @param data 更新データ
 * @returns 更新されたユーザー情報
 */
export async function updateProfile(userId: string, data: ProfileUpdate) {
  const result = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      name: users.name,
      username: users.username,
    });

  return result;
}
