import { SignupForm } from "@/components/auth/signup-form";
import { auth } from "@workspace/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session && params.id) {
    const result = await auth.api.acceptInvitation({
      body: {
        invitationId: params.id,
      },
      headers: await headers(),
    });

    if (result) {
      redirect(`/properties/unconfirmed`);
    }
  }

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
