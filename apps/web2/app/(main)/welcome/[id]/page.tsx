import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";

interface WelcomePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WelcomePage({ params }: WelcomePageProps) {
  const { id: invitationId } = await params;

  // セッションを確認
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    // セッションがない場合はログインページへ
    redirect("/login");
  }

  // 招待を受け入れる
  try {
    const result = await auth.api.acceptInvitation({
      body: {
        invitationId,
      },
      headers: await headers(),
    });

    console.log("招待の受け入れに成功しました:", result);

    // 組織ページへリダイレクト
    redirect("/organization");
  } catch (error) {
    console.error("招待の受け入れに失敗しました:", error);

    // エラーが発生してもダッシュボードへリダイレクト
    redirect("/dashboard");
  }

  // ローディング表示（リダイレクトされるまでの間）
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">組織への参加を処理中...</p>
      </div>
    </div>
  );
}