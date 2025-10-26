import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { Metadata } from "next";
import { AppConfig } from "@/app.config";

export const metadata: Metadata = {
  title: "パスワードリセット",
  description: `${AppConfig.title}アカウントのパスワードを安全にリセットします。`,
};

export default function ForgotPasswordPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
