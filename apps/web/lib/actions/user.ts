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
 * アカウントを削除
 */
export async function deleteAccount() {
  const session = await verifySession();

  // 現時点でBetter AuthにはユーザーがセルフでアカウントHTを削除するAPIがないため、
  // 管理者権限でユーザーを削除する必要があります
  // TODO: Better Authのセルフサービス削除APIが実装されたら置き換える

  // 一時的な実装: セッションを削除してログアウトさせる
  await auth.api.signOut({
    headers: await headers(),
  });

  // 実際の削除処理は管理者が行う必要があります
  // または、削除リクエストをキューに入れて、後で管理者が処理するなどの実装が必要

  throw new Error("アカウント削除機能は現在準備中です");
}
