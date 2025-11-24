"use server";

import { forgotPasswordSchema, loginSchema } from "@/lib/zod/schemas/auth";
import { auth } from "@workspace/auth";
import { headers } from "next/headers";
import type { ForgotPassword, Login, ResetPassword } from "@/lib/types/auth";

export async function loginAction(data: Login) {
  // データの検証
  const validatedData = loginSchema.parse(data);

  try {
    // ログイン処理
    const result = await auth.api.signInEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
      },
      headers: await headers(),
    });

    if (!result) {
      return {
        error: "ログインに失敗しました",
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      error: "ログインに失敗しました",
    };
  }
}

export async function forgotPasswordAction(data: ForgotPassword) {
  const validatedData = forgotPasswordSchema.parse(data);
  const result = await auth.api.forgetPasswordEmailOTP({
    body: {
      email: validatedData.email,
    },
    headers: await headers(),
  });
  if (!result) {
    return {
      error: "パスワードリセットメールを送信に失敗しました",
    };
  }
  return {
    success: true,
    data: result,
  };
}

export async function updatePasswordAction(
  data: ResetPassword,
  otp: string,
  email: string,
) {
  const result = await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: data.password,
    },
    headers: await headers(),
  });
  if (!result) {
    return {
      error: "パスワードの更新に失敗しました",
    };
  }
  return {
    success: true,
    data: result,
  };
}
