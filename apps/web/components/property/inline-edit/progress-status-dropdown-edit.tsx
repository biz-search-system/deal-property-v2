"use client";

import { updatePropertyProgressStatus } from "@/lib/actions/property";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { progressStatus } from "@workspace/drizzle/schemas";
import type { ProgressStatus } from "@workspace/drizzle/types";
import { useState } from "react";
import { toast } from "sonner";
import ProgressStatusBadge from "../badge/progress-status-badge";

interface ProgressStatusDropdownEditProps {
  propertyId: string;
  currentStatus: ProgressStatus;
  onSave?: (propertyId: string, newStatus: string) => void | Promise<void>;
  editable?: boolean;
}

export function ProgressStatusDropdownEdit({
  propertyId,
  currentStatus,
  onSave,
  editable = true,
}: ProgressStatusDropdownEditProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSelect = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(propertyId, newStatus);
      } else {
        await updatePropertyProgressStatus({
          id: propertyId,
          progressStatus: newStatus,
        });
        toast.success("進捗ステータスを更新しました");
      }
    } catch (error) {
      toast.error("進捗ステータスの更新に失敗しました");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!editable) {
    return <ProgressStatusBadge progressStatus={currentStatus} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isSaving}>
        <div className="cursor-pointer">
          <ProgressStatusBadge
            progressStatus={currentStatus}
            className={isSaving ? "opacity-50" : "hover:ring-1 hover:ring-ring"}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {progressStatus.map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={status === currentStatus}
            onCheckedChange={() => handleSelect(status)}
            className="cursor-pointer"
          >
            <ProgressStatusBadge progressStatus={status} maxLength={20} />
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
