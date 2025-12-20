import { SignupForm } from "@/components/auth/signup-form";
import { getInvitationByInvitationId } from "@/lib/data/invite";
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
    id?: string;
  }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const invitationId = params.id;
  if (!invitationId) {
    redirect("/");
  }
  const result = await getInvitationByInvitationId(invitationId);

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  //ログインしているユーザーが招待を受け入れる
  if (session && invitationId) {
    try {
      const acceptResult = await auth.api.acceptInvitation({
        body: {
          invitationId,
        },
        headers: await headers(),
      });

      if (acceptResult) {
        const orgName = encodeURIComponent(
          result?.organizations.name || "組織"
        );
        redirect(`/properties/unconfirmed?invited=${orgName}`);
      }
    } catch (error) {
      console.error("Failed to accept invitation:", error);
      redirect("/");
    }
  }
  // 招待されていないユーザーはホーム画面にリダイレクト
  if (!result) {
    console.log("result", result);
    redirect("/");
  }
  const {
    email: userEmail,
    organizations: { name: organizationName },
  } = result;

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm
          invitationId={invitationId}
          initialEmail={userEmail}
          organizationName={organizationName}
        />
      </div>
    </div>
  );
}
