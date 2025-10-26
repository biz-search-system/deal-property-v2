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
import { createTeamAction } from "@/lib/actions/team";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  onSuccess: () => void;
}

export function CreateTeamDialog({
  open,
  onOpenChange,
  organizationId,
  onSuccess,
}: CreateTeamDialogProps) {
  const [teamName, setTeamName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

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

    startTransition(async () => {
      try {
        await createTeamAction({
          name: teamName,
          organizationId,
        });

        toast.success("チームを作成しました");
        setTeamName("");
        onSuccess();
      } catch (error) {
        const message = error instanceof Error ? error.message : "チームの作成に失敗しました";
        setError(message);
        toast.error(message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>チームを作成</DialogTitle>
            <DialogDescription>
              新しいチームを作成して、メンバーを組織化できます。
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
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              作成
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}