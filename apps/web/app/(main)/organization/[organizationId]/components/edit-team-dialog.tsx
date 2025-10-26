"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { updateTeamAction, deleteTeamAction } from "@/lib/actions/team";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";

interface EditTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  teamName: string;
  onSuccess: () => void;
}

export function EditTeamDialog({
  open,
  onOpenChange,
  teamId,
  teamName: initialTeamName,
  onSuccess,
}: EditTeamDialogProps) {
  const [teamName, setTeamName] = useState(initialTeamName);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!teamName.trim()) {
      setError("チーム名を入力してください");
      return;
    }

    if (teamName.length > 50) {
      setError("チーム名は50文字以内で入力してください");
      return;
    }

    if (teamName === initialTeamName) {
      onOpenChange(false);
      return;
    }

    startTransition(async () => {
      try {
        await updateTeamAction({
          teamId,
          name: teamName,
        });

        toast.success("チーム名を更新しました");
        onSuccess();
      } catch (error) {
        const message = error instanceof Error ? error.message : "チーム名の更新に失敗しました";
        setError(message);
        toast.error(message);
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteTeamAction(teamId);

        toast.success("チームを削除しました");
        setShowDeleteAlert(false);
        onSuccess();
      } catch (error) {
        const message = error instanceof Error ? error.message : "チームの削除に失敗しました";
        toast.error(message);
      }
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>チーム設定</DialogTitle>
              <DialogDescription>
                チーム名の変更やチームの削除ができます。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="team-name">チーム名</Label>
                <Input
                  id="team-name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="例: 営業チーム"
                  disabled={isPending}
                  autoComplete="off"
                />
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">チームを削除</h4>
                    <p className="text-sm text-muted-foreground">
                      この操作は取り消すことができません
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteAlert(true)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                    削除
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                キャンセル
              </Button>
              <Button type="submit" disabled={isPending || teamName === initialTeamName}>
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                更新
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              チーム「{initialTeamName}」を削除すると、チームメンバーの関連付けも削除されます。
              この操作は取り消すことができません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}