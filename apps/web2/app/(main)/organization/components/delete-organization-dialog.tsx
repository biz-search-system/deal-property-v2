"use client";

import { useState } from "react";
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
import { deleteOrganizationAction } from "@/lib/actions/organization";
import { toast } from "sonner";

interface DeleteOrganizationDialogProps {
  open: boolean;
  organizationId?: string;
  organizationName?: string;
  onClose: () => void;
}

export function DeleteOrganizationDialog({
  open,
  organizationId,
  organizationName,
  onClose,
}: DeleteOrganizationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!organizationId) return;

    setIsDeleting(true);
    try {
      const result = await deleteOrganizationAction(organizationId);
      if (result.success) {
        toast.success(`${organizationName || "組織"}を削除しました`);
        onClose();
      } else {
        toast.error(result.error || "組織の削除に失敗しました");
      }
    } catch (err) {
      console.error("Failed to delete organization:", err);
      toast.error("組織の削除に失敗しました");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>組織を削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            {organizationName && (
              <span className="font-semibold">{organizationName}</span>
            )}
            を削除します。この操作は取り消せません。組織のすべてのデータ、メンバー、招待が削除されます。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            キャンセル
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "削除中..." : "削除する"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
