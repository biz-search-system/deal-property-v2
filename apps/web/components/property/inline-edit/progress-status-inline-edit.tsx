"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { progressStatus } from "@workspace/drizzle/schemas";
import ProgressStatusBadge from "../badge/progress-status-badge";
import { updatePropertyProgressStatus } from "@/lib/actions/property";
import { toast } from "sonner";
import type { ProgressStatus } from "@workspace/drizzle/types";

interface ProgressStatusInlineEditProps {
  propertyId: string;
  currentStatus: ProgressStatus;
  // カスタムの保存処理（指定しない場合はデフォルトのサーバーアクションを使用）
  onSave?: (propertyId: string, newStatus: string) => void | Promise<void>;
  // 編集可能かどうか
  editable?: boolean;
}

export function ProgressStatusInlineEdit({
  propertyId,
  currentStatus,
  onSave,
  editable = true,
}: ProgressStatusInlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentStatus);

  const handleSave = async (newStatus: string) => {
    try {
      if (onSave) {
        await onSave(propertyId, newStatus);
      } else {
        // デフォルトのサーバーアクション
        await updatePropertyProgressStatus({
          id: propertyId,
          progressStatus: newStatus,
        });
        toast.success("進捗ステータスを更新しました");
      }
      setIsEditing(false);
    } catch (error) {
      toast.error("進捗ステータスの更新に失敗しました");
      console.error(error);
      // エラー時は元の値に戻す
      setValue(currentStatus);
    }
  };

  if (!editable) {
    return <ProgressStatusBadge progressStatus={currentStatus} />;
  }

  return isEditing ? (
    <Select
      value={value}
      onValueChange={(newValue) => {
        setValue(newValue as ProgressStatus);
        handleSave(newValue);
      }}
    >
      <SelectTrigger className="h-auto p-1">
        <SelectValue>
          {value && (
            <ProgressStatusBadge
              progressStatus={value}
              className="text-[9px]"
            />
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {progressStatus.map((status) => (
          <SelectItem key={status} value={status}>
            <ProgressStatusBadge
              progressStatus={status}
              className="text-[9px]"
            />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : (
    <ProgressStatusBadge
      progressStatus={currentStatus}
      onClick={() => {
        setIsEditing(true);
        setValue(currentStatus);
      }}
    />
  );
}
