"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { inviteMemberAction } from "@/lib/actions/organization";
import {
  useOrganizationMembers,
  useOrganizationInvitations,
} from "@/lib/swr/organization";

interface InviteTabProps {
  organizationId: string;
}

export function InviteTab({ organizationId }: InviteTabProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "owner" | "admin">(
    "member"
  );
  const [sendingInvite, setSendingInvite] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { mutate: mutatemembers } = useOrganizationMembers(organizationId);
  const { mutate: mutateInvitations } =
    useOrganizationInvitations(organizationId);

  const handleInvite = async () => {
    if (!inviteEmail) return;

    setSendingInvite(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await inviteMemberAction({
        email: inviteEmail,
        role: inviteRole,
        organizationId,
      });

      if (result.success) {
        setSuccess("招待を送信しました");
        setInviteEmail("");
        setInviteRole("member");
        await Promise.all([mutatemembers(), mutateInvitations()]);
      } else {
        setError(result.error || "招待の送信に失敗しました");
      }
    } catch (err) {
      console.error("Failed to invite member:", err);
      setError("招待の送信中にエラーが発生しました");
    } finally {
      setSendingInvite(false);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

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
              disabled={sendingInvite}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">役割</Label>
            <Select
              value={inviteRole}
              onValueChange={(value) =>
                setInviteRole(value as "member" | "owner" | "admin")
              }
              disabled={sendingInvite}
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">メンバー</SelectItem>
                <SelectItem value="admin">管理者</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleInvite}
            disabled={!inviteEmail || sendingInvite}
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
