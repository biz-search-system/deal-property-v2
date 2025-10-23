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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { useOrganizationMembers } from "@/lib/swr/organization";
import {
  removeMemberAction,
  updateMemberRoleAction,
} from "@/lib/actions/organization";

interface MembersTabProps {
  organizationId: string;
}

export function MembersTab({ organizationId }: MembersTabProps) {
  const { data, isLoading, error, mutate } =
    useOrganizationMembers(organizationId);

  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRemoveMember = async () => {
    if (!deleteMemberId) return;

    try {
      const member = data?.members.find((m) => m.id === deleteMemberId);
      if (!member) return;

      const result = await removeMemberAction(
        member.user.email,
        organizationId
      );

      if (result.success) {
        setSuccess("メンバーを削除しました");
        await mutate();
      } else {
        setActionError(result.error || "メンバーの削除に失敗しました");
      }
    } catch (err) {
      console.error("Failed to remove member:", err);
      setActionError("メンバーの削除中にエラーが発生しました");
    } finally {
      setDeleteMemberId(null);
    }
  };

  const handleRoleChange = async (
    memberId: string,
    newRole: "member" | "owner" | "admin"
  ) => {
    try {
      const result = await updateMemberRoleAction(
        memberId,
        newRole,
        organizationId
      );

      if (result.success) {
        setSuccess("役割を更新しました");
        await mutate();
      } else {
        setActionError(result.error || "役割の更新に失敗しました");
      }
    } catch (err) {
      console.error("Failed to update role:", err);
      setActionError("役割の更新中にエラーが発生しました");
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
          メンバー情報の取得中にエラーが発生しました
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
          <CardTitle>組織のメンバー</CardTitle>
          <CardDescription>
            現在の組織のメンバーと役割を管理します
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名前</TableHead>
                <TableHead>メールアドレス</TableHead>
                <TableHead>役割</TableHead>
                <TableHead>参加日</TableHead>
                <TableHead>アクション</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.user.name}
                  </TableCell>
                  <TableCell>{member.user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={member.role}
                      onValueChange={(value) =>
                        handleRoleChange(
                          member.id,
                          value as "member" | "owner" | "admin"
                        )
                      }
                      disabled={member.role === "owner"}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">メンバー</SelectItem>
                        <SelectItem value="admin">管理者</SelectItem>
                        {member.role === "owner" && (
                          <SelectItem value="owner">オーナー</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {new Date(
                      typeof member.createdAt === "string"
                        ? member.createdAt
                        : member.createdAt
                    ).toLocaleDateString("ja-JP")}
                  </TableCell>
                  <TableCell>
                    {member.role !== "owner" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteMemberId(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">メンバーを削除</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deleteMemberId}
        onOpenChange={() => setDeleteMemberId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>メンバーを削除しますか?</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。メンバーは組織から削除され、すべての権限が失われます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-red-600 hover:bg-red-700"
            >
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
