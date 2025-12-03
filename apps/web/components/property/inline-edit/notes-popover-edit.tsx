"use client";

import { useState, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { updatePropertyNotes } from "@/lib/actions/property";
import { toast } from "sonner";

interface NotesPopoverEditProps {
  propertyId: string;
  currentNotes: string | null;
  // カスタムの保存処理（指定しない場合はデフォルトのサーバーアクションを使用）
  onSave?: (propertyId: string, newNotes: string) => void | Promise<void>;
  // 編集可能かどうか
  editable?: boolean;
  // 最大文字数（表示用）
  maxLength?: number;
}

export function NotesPopoverEdit({
  propertyId,
  currentNotes,
  onSave,
  editable = true,
  maxLength = 120,
}: NotesPopoverEditProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentNotes || "");
  const [isSaving, setIsSaving] = useState(false);

  // propsの値が変更されたときにステートを同期（テーブルの再ソート対応）
  useEffect(() => {
    if (!open) {
      setValue(currentNotes || "");
    }
  }, [currentNotes, open]);

  const handleSave = async () => {
    setIsSaving(true);
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
      setOpen(false);
    } catch (error) {
      toast.error("備考の更新に失敗しました");
      console.error(error);
      // エラー時は元の値に戻す
      setValue(currentNotes || "");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(currentNotes || "");
    setOpen(false);
  };

  if (!editable) {
    return (
      <div
        className="text-[10px] truncate break-all"
        // className={`text-[10px] truncate break-all max-w-[${maxLength}px]`}
        title={currentNotes || ""}
      >
        {currentNotes || <span className="text-muted-foreground">-</span>}
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={`cursor-pointer hover:bg-muted px-1 rounded text-[10px] truncate break-all max-w-[${maxLength}px]`}
          title={currentNotes || ""}
        >
          {currentNotes || <span className="text-muted-foreground">入力</span>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">備考編集</h4>
            <p className="text-sm text-muted-foreground">
              物件に関する備考を編集できます
            </p>
          </div>
          <div className="grid gap-2">
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="備考を入力してください"
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              {value.length} / 500
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isSaving}
            >
              キャンセル
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "保存中..." : "保存"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
