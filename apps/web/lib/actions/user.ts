"use server";

import { verifySession } from "@/lib/data/sesstion";
import { PasswordChange } from "@/lib/types/auth";
import { auth } from "@workspace/auth";
import { ProfileUpdate } from "@workspace/drizzle/types";
import { profileUpdateSchema } from "@workspace/drizzle/zod-schemas";
import { resolveImageUpload } from "@workspace/utils/storage";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { passwordChangeSchema } from "../zod/schemas/auth";

/**
 * ユーザー情報を更新
 */
export async function updateProfileAction(data: ProfileUpdate) {
  const session = await verifySession();
  const userId = session.user.id;
  const { name, username, image } = profileUpdateSchema.parse(data);

  const imageUrl = image.startsWith("http")
    ? image
    : (await resolveImageUpload(`avatars/${userId}`, image)) +
      `?v=${Date.now()}`;

  await resolveImageUpload(`avatars/${userId}`, image);
  await auth.api.updateUser({
    headers: await headers(),
    body: {
      name,
      username,
      image: imageUrl,
    },
  });

  revalidatePath("/");
}

/**
 * パスワードを変更
 */
export async function changePassword(data: PasswordChange) {
  await verifySession();
  const validatedData = passwordChangeSchema.parse(data);
  // Better Authのパスワード変更APIを使用
  const result = await auth.api
    .changePassword({
      body: {
        currentPassword: validatedData.currentPassword,
        newPassword: validatedData.newPassword,
      },
      headers: await headers(),
    })
    .catch((error) => {
      console.error("パスワードの変更に失敗しました", error.message);
      return {
        error:
          error.message === "Invalid password"
            ? "現在のパスワードが間違っています"
            : "パスワードの変更に失敗しました",
      };
    });

  if (result && "error" in result) {
    throw new Error(result.error);
  }

  revalidatePath("/account");
}

/**
 * アカウントを削除（論理削除）
 * Better Authのbanユーザー機能を使用して、ユーザーをBANすることで論理削除を実現します。
 * BANされたユーザーはログインできなくなり、データは保持されます。
 */
export async function deleteAccount() {
  const session = await verifySession();
  const userId = session.user.id;

  // ユーザーをBANして論理削除
  await auth.api.banUser({
    body: {
      userId,
      banReason: "アカウント削除リクエスト",
    },
  });

  // セッションを削除してログアウト
  await auth.api.signOut({
    headers: await headers(),
  });
}
