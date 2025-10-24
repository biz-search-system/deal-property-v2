"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createOrganizationAction,
  setActiveOrganizationAction,
} from "@/lib/actions/organization";
import { generateId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Building2, AlertCircle } from "lucide-react";

export function CreateOrganizationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 一意のIDを自動生成
      const slug = generateId();

      const result = await createOrganizationAction({
        name: name,
        slug: slug,
      });

      if (!result.success) {
        setError(result.error || "組織の作成に失敗しました");
        return;
      }

      // 作成成功後、組織をアクティブに設定
      if (result.data?.id) {
        await setActiveOrganizationAction(result.data.id);
      }

      // フォームをリセット
      setName("");

      // 組織一覧ページへリダイレクト
      router.push("/organization");
      router.refresh();
    } catch (err) {
      console.error("Failed to create organization:", err);
      setError("予期しないエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          <CardTitle>新しい組織を作成</CardTitle>
        </div>
        <CardDescription>
          組織を作成してメンバーを招待し、共同作業を開始しましょう
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">組織名</Label>
            <Input
              id="name"
              placeholder="例: Acme Corporation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              組織には自動的に一意のIDが割り当てられます
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setName("");
              setError(null);
            }}
            disabled={isLoading}
          >
            クリア
          </Button>
          <Button type="submit" disabled={isLoading || !name}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                作成中...
              </>
            ) : (
              "組織を作成"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
