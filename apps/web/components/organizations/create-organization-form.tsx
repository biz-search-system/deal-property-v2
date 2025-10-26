"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createOrganizationAction,
  setActiveOrganizationAction,
} from "@/lib/actions/organization";
import { customNanoid } from "@workspace/utils";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Loader2, Building2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function CreateOrganizationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 一意のIDを自動生成
      const slug = customNanoid(10);

      const result = await createOrganizationAction({
        name: name,
        slug: slug,
      });

      if (!result.success) {
        toast.error(result.error || "組織の作成に失敗しました");
        return;
      }

      // 作成成功後、組織をアクティブに設定
      if (result.data?.id) {
        await setActiveOrganizationAction(result.data.id);
        toast.success("組織を作成しました");
      }

      // フォームをリセット
      setName("");

      // 組織一覧ページへリダイレクト
      router.push("/organization");
      router.refresh();
    } catch (err) {
      console.error("Failed to create organization:", err);
      toast.error("予期しないエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <CardTitle>新しい組織を作成</CardTitle>
        </div>
        <CardDescription>
          案件を管理する組織（会社）を作成しましょう
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pb-6">
          <div className="text-sm flex flex-col gap-2 md:grid md:grid-cols-12">
            <Label htmlFor="name" className="whitespace-nowrap col-span-4">
              組織名
            </Label>
            <Input
              id="name"
              className="col-span-8"
              placeholder="例: 株式会社ABC"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t">
          <Button type="button" variant="outline" disabled={isLoading} asChild>
            <Link href="/organization">キャンセル</Link>
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
