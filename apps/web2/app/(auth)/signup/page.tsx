import { SignupForm } from "@/components/signup/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "新規登録",
  description: "アカウントを作成",
};

interface SignupPageProps {
  searchParams: Promise<{
    id: string;
    email: string;
    org: string;
  }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm
          invitationId={params.id}
          initialEmail={params.email}
          organizationName={params.org}
        />
      </div>
    </div>
  );
}
