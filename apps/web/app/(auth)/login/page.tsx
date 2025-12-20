import { LoginForm } from "@/components/auth/login-form";
import { getInvitationByInvitationId } from "@/lib/data/invite";
import { Metadata } from "next";

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

  // 招待IDがある場合は組織名を取得
  let organizationName: string | undefined;
  if (invitationId) {
    const invitation = await getInvitationByInvitationId(invitationId);
    organizationName = invitation?.organizations.name;
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm invitationId={invitationId} organizationName={organizationName} />
      </div>
    </div>
  );
}
