import { Metadata } from "next";
import { AppConfig } from "@/app.config";
import { verifySession } from "@/lib/data/sesstion";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "パスワード更新",
  description: `${AppConfig.title}アカウントのパスワードを安全に更新します。`,
};

export default async function ResetPasswordPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
