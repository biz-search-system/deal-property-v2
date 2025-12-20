import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "ログイン",
  description: "ログインページ",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ invitationId?: string }>;
}) {
  const params = await searchParams;
  const invitationId = params.invitationId;
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm invitationId={invitationId} />
      </div>
    </div>
  );
}
