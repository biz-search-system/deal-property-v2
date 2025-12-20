"use client";

import { useState, useTransition } from "react";
import { deleteAccount } from "@/lib/actions/user";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export function DangerZoneCard() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const confirmationText = "削除する";

  const handleDeleteAccount = () => {
    if (confirmText !== confirmationText) {
      toast.error("確認テキストが一致しません");
      return;
    }

    startTransition(async () => {
      try {
        await deleteAccount();
        toast.success("アカウントを削除しました");
        router.push("/");
      } catch (error) {
        toast.error("アカウントの削除に失敗しました");
        console.error(error);
      }
    });
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <CardTitle className="text-destructive">危険ゾーン</CardTitle>
        </div>
        <CardDescription>
          これらの操作は元に戻すことができません。慎重に実行してください。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">アカウントの削除</h4>
            <p className="text-sm text-muted-foreground mb-4">
              アカウントを削除すると、すべてのデータが完全に削除されます。この操作は取り消すことができません。
            </p>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">アカウントを削除</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-destructive">
                    本当にアカウントを削除しますか？
                  </DialogTitle>
                  <DialogDescription className="space-y-2">
                    <p>この操作は取り消すことができません。</p>
                    <p>以下の内容がすべて削除されます：</p>
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                      <li>プロフィール情報</li>
                      <li>保存された設定</li>
                      <li>すべての関連データ</li>
                    </ul>
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="confirm-delete">
                      確認のため「{confirmationText}」と入力してください
                    </Label>
                    <Input
                      id="confirm-delete"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder={confirmationText}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsOpen(false);
                      setConfirmText("");
                    }}
                    disabled={isPending}
                  >
                    キャンセル
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isPending || confirmText !== confirmationText}
                  >
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    完全に削除
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
