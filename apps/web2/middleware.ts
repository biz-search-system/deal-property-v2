import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { get } from "@vercel/edge-config";
import { MaintenanceConfig } from "@/lib/types/maintenance";
import { handleMaintenanceMode } from "@/lib/maintenance";

const publicRoutes = [
  "/login",
  "/signup",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/",
  "/maintenance",
];

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const currentPath = request.nextUrl.pathname;
  const isPrivateRoute = !publicRoutes.includes(currentPath);

  // 認証が必要なページへの未認証アクセス
  if (!sessionCookie && isPrivateRoute) {
    const loginPageUrl = request.nextUrl.clone();
    loginPageUrl.pathname = "/login";
    return NextResponse.redirect(loginPageUrl);
  }
  // メンテナンスモード
  const maintenance = await get<MaintenanceConfig>("maintenance");
  await handleMaintenanceMode(request, maintenance ?? null);

  // 認証済みユーザーがログインページにアクセス
  if (sessionCookie && currentPath === "/login") {
    const defaultDashboardUrl = request.nextUrl.clone();
    defaultDashboardUrl.pathname = "/properties/unconfirmed";
    return NextResponse.redirect(defaultDashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  // 下記のmatcherは、APIルート（/api）、静的ファイル（/static）、Next.jsの内部ファイル（_next）や拡張子付きファイル（画像やアイコンなど）を除外し、
  // 通常のページルートのみをmiddlewareの対象。
  matcher: ["/((?!api|static|.*\\..*|_next).*)"],
};
