import { auth } from "@workspace/auth";
import { getBaseURL } from "@workspace/utils";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

/**
 *
 * @param request リクエスト
 * @returns リダイレクト
 * パスワードリセットメール
 * sendResetPasswordEmailに設定されたredirectToにリダイレクト
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");
  const type = searchParams.get("type");

  if (!email || !otp || type !== "forget-password") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const data = await auth.api.checkVerificationOTP({
    body: {
      email,
      type,
      otp,
    },
    headers: await headers(),
  });
  if (!data.success) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

  const redirectTo = `${getBaseURL()}/reset-password?otp=${otp}&email=${email}`;
  return NextResponse.redirect(redirectTo);
}
