"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Label } from "@workspace/ui/components/label";
import { useTeamMembers } from "@/lib/swr/team";
import { useOrganizationMembers } from "@/lib/swr/organization";
import {
  addTeamMemberAction,
  removeTeamMemberAction,
} from "@/lib/actions/team";
import { toast } from "sonner";
import { Loader2, UserX, UserPlus } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { getAvatarUrl } from "@/lib/avatar";

interface TeamMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  organizationId: string;
  onUpdate: () => void;
}

export function TeamMembersDialog({
  open,
  onOpenChange,
  teamId,
  organizationId,
  onUpdate,
}: TeamMembersDialogProps) {
  const {
    members: teamMembers,
    isLoading: teamLoading,
    mutate: mutateTeam,
  } = useTeamMembers(teamId);
  const { organizationMembers, isLoading: orgLoading } =
    useOrganizationMembers(organizationId);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  // チームに所属していない組織メンバーを取得
  const availableMembers = organizationMembers?.members.filter(
    (orgMember) =>
      !teamMembers?.some(
        (teamMember) => teamMember.userId === orgMember.user.id,
      ),
  );

  const handleAddMember = () => {
    if (!selectedUserId) return;

    startTransition(async () => {
      try {
        await addTeamMemberAction({
          teamId,
          userId: selectedUserId,
        });

        toast.success("メンバーを追加しました");
        setSelectedUserId("");
        mutateTeam();
        onUpdate();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "メンバーの追加に失敗しました";
        toast.error(message);
      }
    });
  };

  const handleRemoveMember = (userId: string, userName: string | null) => {
    startTransition(async () => {
      try {
        await removeTeamMemberAction({
          teamId,
          userId,
        });

        toast.success(`${userName || "メンバー"}を削除しました`);
        mutateTeam();
        onUpdate();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "メンバーの削除に失敗しました";
        toast.error(message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>チームメンバー管理</DialogTitle>
          <DialogDescription>
            チームにメンバーを追加または削除します。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* メンバー追加セクション */}
          <div className="space-y-2">
            <Label>メンバーを追加</Label>
            <div className="flex gap-2">
              <Select
                value={selectedUserId}
                onValueChange={setSelectedUserId}
                disabled={isPending || orgLoading || !availableMembers?.length}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue
                    placeholder={
                      orgLoading
                        ? "読み込み中..."
                        : !availableMembers?.length
                          ? "追加可能なメンバーがいません"
                          : "メンバーを選択"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableMembers?.map((member) => {
                    const avatarData = getAvatarUrl({
                      username: member.user.name,
                      email: member.user.email,
                      avatarUrl: member.user.image,
                    });
                    return (
                      <SelectItem key={member.user.id} value={member.user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={avatarData.url} />
                            <AvatarFallback className="text-xs">
                              {avatarData.text}
                            </AvatarFallback>
                          </Avatar>
                          <span>{member.user.name || member.user.email}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddMember}
                disabled={!selectedUserId || isPending}
                size="sm"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                追加
              </Button>
            </div>
          </div>

          {/* メンバー一覧セクション */}
          <div className="space-y-2">
            <Label>現在のメンバー</Label>
            <div className="border rounded-lg max-h-80 overflow-y-auto">
              {teamLoading ? (
                <div className="p-4 space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : !teamMembers || teamMembers.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  まだメンバーがいません
                </div>
              ) : (
                <div className="divide-y">
                  {teamMembers.map((member) => {
                    const user = organizationMembers?.members.find(
                      (m) => m.user.id === member.userId,
                    )?.user;

                    const avatarData = getAvatarUrl({
                      username: user?.name,
                      email: user?.email,
                    });

                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={avatarData.url} />
                            <AvatarFallback>{avatarData.text}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {user?.name || "名前未設定"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user?.email || "メールアドレス未設定"}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleRemoveMember(
                              member.userId,
                              user?.name || null,
                            )
                          }
                          disabled={isPending}
                        >
                          <UserX className="h-4 w-4" />
                          <span className="sr-only">削除</span>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
