"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Textarea } from "@workspace/ui/components/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface TextPopoverEditProps {
  /** 対象のID */
  id: string;
  /** 現在の値 */
  currentValue: string | null;
  /** 保存処理 */
  onSave: (id: string, newValue: string) => void | Promise<void>;
  /** 編集可能かどうか */
  editable?: boolean;
  /** 入力の最大文字数 */
  maxLength?: number;
  /** 必須かどうか */
  required?: boolean;
  /** ポップオーバーのタイトル */
  title: string;
  /** ポップオーバーの説明 */
  description?: string;
  /** プレースホルダー */
  placeholder?: string;
  /** 成功時のメッセージ */
  successMessage?: string;
  /** エラー時のメッセージ */
  errorMessage?: string;
  /** 必須エラーのメッセージ */
  requiredErrorMessage?: string;
  /** 空の場合の表示テキスト */
  emptyText?: string;
}

export function TextPopoverEdit({
  id,
  currentValue,
  onSave,
  editable = true,
  maxLength = 500,
  required = false,
  title,
  description,
  placeholder,
  successMessage = "更新しました",
  errorMessage = "更新に失敗しました",
  requiredErrorMessage = "入力は必須です",
  emptyText = "入力",
}: TextPopoverEditProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentValue || "");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (required && !value.trim()) {
      toast.error(requiredErrorMessage);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(id, value.trim());
      toast.success(successMessage);
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(errorMessage);
      console.error(error);
      setValue(currentValue || "");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(currentValue || "");
    setOpen(false);
  };

  if (!editable) {
    return (
      <div
        className="max-w-full w-full truncate text-[10px]"
        title={currentValue || ""}
      >
        {currentValue || <span className="text-muted-foreground">-</span>}
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-auto max-w-full w-full p-1 justify-start text-[10px] font-normal transition-[color,box-shadow] hover:bg-transparent hover:ring-ring/50 hover:ring-[3px]",
            !currentValue && "text-muted-foreground"
          )}
          title={currentValue || ""}
        >
          <p className="truncate">{currentValue || emptyText}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{title}</h4>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="min-h-[80px] resize-none"
              maxLength={maxLength}
            />
            <div className="text-right text-xs text-muted-foreground">
              {value.length} / {maxLength}
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
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving || (required && !value.trim())}
            >
              {isSaving ? "保存中..." : "保存"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
