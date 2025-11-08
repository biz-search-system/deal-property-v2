"use client";

import { useState } from "react";
import { Input } from "@workspace/ui/components/input";
import { updatePropertyNotes } from "@/lib/actions/property";
import { toast } from "sonner";

interface NotesInlineEditProps {
  propertyId: string;
  currentNotes: string | null;
  // カスタムの保存処理（指定しない場合はデフォルトのサーバーアクションを使用）
  onSave?: (propertyId: string, newNotes: string) => void | Promise<void>;
  // 編集可能かどうか
  editable?: boolean;
  // 最大文字数（表示用）
  maxLength?: number;
}

export function NotesInlineEdit({
  propertyId,
  currentNotes,
  onSave,
  editable = true,
  maxLength = 120,
}: NotesInlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentNotes || "");

  const handleSave = async () => {
    try {
      if (onSave) {
        await onSave(propertyId, value);
      } else {
        // デフォルトのサーバーアクション
        await updatePropertyNotes({
          id: propertyId,
          notes: value,
        });
        toast.success("備考を更新しました");
      }
      setIsEditing(false);
    } catch (error) {
      toast.error("備考の更新に失敗しました");
      console.error(error);
      // エラー時は元の値に戻す
      setValue(currentNotes || "");
    }
  };

  if (!editable) {
    return (
      <div
        className={`text-[10px] truncate break-all max-w-[${maxLength}px]`}
        title={currentNotes || ""}
      >
        {currentNotes || (
          <span className="text-muted-foreground">-</span>
        )}
      </div>
    );
  }

  return isEditing ? (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="h-5 text-[10px] p-1"
      onBlur={handleSave}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSave();
        } else if (e.key === "Escape") {
          setValue(currentNotes || "");
          setIsEditing(false);
        }
      }}
      autoFocus
    />
  ) : (
    <div
      className={`cursor-pointer hover:bg-muted px-1 rounded text-[10px] truncate break-all max-w-[${maxLength}px]`}
      onClick={() => {
        setIsEditing(true);
        setValue(currentNotes || "");
      }}
      title={currentNotes || ""}
    >
      {currentNotes || (
        <span className="text-muted-foreground">入力</span>
      )}
    </div>
  );
}