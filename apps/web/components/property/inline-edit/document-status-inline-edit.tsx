"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { documentStatus } from "@workspace/drizzle/schemas";
import DocumentStatusBadge from "../badge/document-status-badge";
import { updatePropertyDocumentStatus } from "@/lib/actions/property";
import { toast } from "sonner";
import type { DocumentStatus } from "@workspace/drizzle/types";

interface DocumentStatusInlineEditProps {
  propertyId: string;
  currentStatus: DocumentStatus;
  // カスタムの保存処理（指定しない場合はデフォルトのサーバーアクションを使用）
  onSave?: (propertyId: string, newStatus: string) => void | Promise<void>;
  // 編集可能かどうか
  editable?: boolean;
}

export function DocumentStatusInlineEdit({
  propertyId,
  currentStatus,
  onSave,
  editable = true,
}: DocumentStatusInlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentStatus);

  const handleSave = async (newStatus: string) => {
    try {
      if (onSave) {
        await onSave(propertyId, newStatus);
      } else {
        // デフォルトのサーバーアクション
        await updatePropertyDocumentStatus({
          id: propertyId,
          documentStatus: newStatus,
        });
        toast.success("書類ステータスを更新しました");
      }
      setIsEditing(false);
    } catch (error) {
      toast.error("書類ステータスの更新に失敗しました");
      console.error(error);
      // エラー時は元の値に戻す
      setValue(currentStatus);
    }
  };

  if (!editable) {
    return <DocumentStatusBadge documentStatus={currentStatus} />;
  }

  return isEditing ? (
    <Select
      value={value}
      onValueChange={(newValue) => {
        setValue(newValue as DocumentStatus);
        handleSave(newValue);
      }}
    >
      <SelectTrigger className="h-auto p-1">
        <SelectValue>
          {value && (
            <DocumentStatusBadge
              documentStatus={value}
              className="text-[9px]"
            />
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {documentStatus.map((status) => (
          <SelectItem key={status} value={status}>
            <DocumentStatusBadge
              documentStatus={status}
              className="text-[9px]"
            />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : (
    <DocumentStatusBadge
      documentStatus={currentStatus}
      onClick={() => {
        setIsEditing(true);
        setValue(currentStatus);
      }}
    />
  );
}
