"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, XCircle, AlertCircle, CheckCircle } from "lucide-react";
import { useOrganizationInvitations } from "@/lib/swr/organization";
import { cancelInvitationAction } from "@/lib/actions/organization";

interface InvitationsTabProps {
  organizationId: string;
}

export function InvitationsTab({ organizationId }: InvitationsTabProps) {
  const { data, isLoading, error, mutate } =
    useOrganizationInvitations(organizationId);
  const [actionError, setActionError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      const result = await cancelInvitationAction(invitationId);

      if (result.success) {
        setSuccess("招待をキャンセルしました");
        await mutate();
      } else {
        setActionError(result.error || "招待のキャンセルに失敗しました");
      }
    } catch (err) {
      console.error("Failed to cancel invitation:", err);
      setActionError("招待のキャンセル中にエラーが発生しました");
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return <Badge variant="destructive">オーナー</Badge>;
      case "admin":
        return <Badge variant="default">管理者</Badge>;
      default:
        return <Badge variant="secondary">メンバー</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">保留中</Badge>;
      case "accepted":
        return <Badge variant="default">承認済み</Badge>;
      case "rejected":
        return <Badge variant="destructive">拒否</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          招待情報の取得中にエラーが発生しました
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      {actionError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{actionError}</AlertDescription>
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
          <CardTitle>招待状一覧</CardTitle>
          <CardDescription>送信済みの招待状を管理します</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>メールアドレス</TableHead>
                <TableHead>役割</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>有効期限</TableHead>
                <TableHead>招待者</TableHead>
                <TableHead>アクション</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell>{invitation.email}</TableCell>
                  <TableCell>{getRoleBadge(invitation.role)}</TableCell>
                  <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                  <TableCell>
                    {new Date(
                      typeof invitation.expiresAt === "string"
                        ? invitation.expiresAt
                        : invitation.expiresAt
                    ).toLocaleDateString("ja-JP")}
                  </TableCell>
                  <TableCell>{invitation.inviterId || "不明"}</TableCell>
                  <TableCell>
                    {invitation.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelInvitation(invitation.id)}
                      >
                        <XCircle className="h-4 w-4" />
                        <span className="sr-only">招待をキャンセル</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
