"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  leaveOrganizationAction,
  setActiveOrganizationAction,
} from "@/lib/actions/organization";
import {
  CheckCircle,
  LogOut,
  MoreVertical,
  Settings,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteOrganizationDialog } from "./delete-organization-dialog";

interface OrganizationCardMenuProps {
  organizationId: string;
  organizationName: string;
  isActive?: boolean;
  isOwner: boolean;
}

export function OrganizationCardMenu({
  organizationId,
  organizationName,
  isActive,
  isOwner,
}: OrganizationCardMenuProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // アクティブな組織を設定
  const handleSetActive = async () => {
    try {
      const result = await setActiveOrganizationAction(organizationId);
      if (result.success) {
        toast.success(`${organizationName}をアクティブに設定しました`);
      }
    } catch (err) {
      toast.error("組織をアクティブに設定できませんでした");
    }
  };

  // 組織から退出
  const handleLeave = async () => {
    try {
      const result = await leaveOrganizationAction(organizationId);
      if (result.success) {
        toast.success("組織から退出しました");
      }
    } catch (err) {
      console.error("Failed to leave organization:", err);
      toast.error("組織からの退出に失敗しました");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" onClick={(e) => e.preventDefault()}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isActive !== undefined && !isActive && (
            <DropdownMenuItem onClick={handleSetActive}>
              <CheckCircle className="mr-2 h-4 w-4" />
              アクティブにする
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => router.push(`/organization/${organizationId}`)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            メンバー管理
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            設定
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {!isOwner && (
            <DropdownMenuItem onClick={handleLeave} className="text-orange-600">
              <LogOut className="mr-2 h-4 w-4" />
              組織から退出
            </DropdownMenuItem>
          )}
          {isOwner && (
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                setShowDeleteDialog(true);
              }}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              組織を削除
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteOrganizationDialog
        open={showDeleteDialog}
        organizationId={organizationId}
        organizationName={organizationName}
        onClose={() => setShowDeleteDialog(false)}
      />
    </>
  );
}
