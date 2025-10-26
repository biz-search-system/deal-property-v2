"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Mail, Loader2, AlertCircle, Users } from "lucide-react";
import { inviteMemberAction } from "@/lib/actions/organization";
import { toast } from "sonner";
import {
  useOrganizationMembers,
  useOrganizationInvitations,
  useCurrentUserOrganizationInfo,
} from "@/lib/swr/organization";

interface InviteTabProps {
  organizationId: string;
}

export function InviteTab({ organizationId }: InviteTabProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "owner" | "admin">(
    "member"
  );
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [sendingInvite, setSendingInvite] = useState(false);

  const { mutate: mutatemembers } = useOrganizationMembers(organizationId);
  const { mutate: mutateInvitations } =
    useOrganizationInvitations(organizationId);
  const { data: currentUserInfo, isLoading: loadingUserInfo } =
    useCurrentUserOrganizationInfo(organizationId);

  // 選択可能なチーム一覧を取得
  const availableTeams = currentUserInfo?.teams?.filter(team =>
    currentUserInfo.role === "owner" || team.isMember
  ) || [];

  const handleInvite = async () => {
    if (!inviteEmail) return;

    setSendingInvite(true);

    try {
      const inviteData = {
        email: inviteEmail,
        role: inviteRole,
        organizationId,
        ...(selectedTeamId ? { teamId: selectedTeamId } : {})
      };

      const result = await inviteMemberAction(inviteData);

      if (result.success) {
        toast.success("チームへの招待を送信しました");
        setInviteEmail("");
        setInviteRole("member");
        setSelectedTeamId("");
        await Promise.all([mutatemembers(), mutateInvitations()]);
      } else {
        toast.error(result.error || "招待の送信に失敗しました");
      }
    } catch (err) {
      console.error("Failed to invite member:", err);
      toast.error("招待の送信中にエラーが発生しました");
    } finally {
      setSendingInvite(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>メンバーを招待</CardTitle>
          <CardDescription>新しいメンバーを組織に招待します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              disabled={sendingInvite || loadingUserInfo}
              autoComplete="off"
            />
          </div>

          <div className={availableTeams.length > 0 ? "grid grid-cols-2 gap-4" : "space-y-2"}>
            <div className="space-y-2">
              <Label htmlFor="role">役割</Label>
              <Select
                value={inviteRole}
                onValueChange={(value) =>
                  setInviteRole(value as "member" | "owner" | "admin")
                }
                disabled={sendingInvite || loadingUserInfo}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">メンバー</SelectItem>
                  <SelectItem value="admin">管理者</SelectItem>
                  {currentUserInfo?.role === "owner" && (
                    <SelectItem value="owner">オーナー</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* チーム選択セクション */}
            {availableTeams.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="team">チーム</Label>
                <Select
                  value={selectedTeamId}
                  onValueChange={setSelectedTeamId}
                  disabled={sendingInvite || loadingUserInfo}
                >
                  <SelectTrigger id="team">
                    <SelectValue placeholder="チームを選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{team.name}</span>
                          {currentUserInfo?.role === "admin" && team.isMember && (
                            <span className="text-xs text-muted-foreground">
                              （所属チーム）
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {availableTeams.length === 0 && !loadingUserInfo && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {currentUserInfo?.role === "admin"
                  ? "所属しているチームがありません。チームに参加してから招待してください。"
                  : "組織にチームが作成されていません。先にチームを作成してください。"}
              </AlertDescription>
            </Alert>
          )}

          {currentUserInfo?.role === "admin" && availableTeams.length > 0 && (
            <p className="text-xs text-muted-foreground">
              管理者は所属しているチームにのみメンバーを招待できます
            </p>
          )}

          <Button
            onClick={handleInvite}
            disabled={!inviteEmail || sendingInvite || loadingUserInfo || (availableTeams.length > 0 && !selectedTeamId)}
            className="w-full"
          >
            {sendingInvite ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                送信中...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                招待を送信
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
