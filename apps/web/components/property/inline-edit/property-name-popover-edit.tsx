"use client";

import { updatePropertyName } from "@/lib/actions/property";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { useState } from "react";
import { toast } from "sonner";

interface PropertyNamePopoverEditProps {
  propertyId: string;
  currentName: string;
  onSave?: (propertyId: string, newName: string) => void | Promise<void>;
  editable?: boolean;
  maxDisplayLength?: number;
}

export function PropertyNamePopoverEdit({
  propertyId,
  currentName,
  onSave,
  editable = true,
  maxDisplayLength = 120,
}: PropertyNamePopoverEditProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentName);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!value.trim()) {
      toast.error("物件名は必須です");
      return;
    }

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(propertyId, value.trim());
      } else {
        await updatePropertyName({
          id: propertyId,
          propertyName: value.trim(),
        });
        toast.success("物件名を更新しました");
      }
      setOpen(false);
    } catch (error) {
      toast.error("物件名の更新に失敗しました");
      console.error(error);
      setValue(currentName);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(currentName);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!editable) {
    return (
      <div
        className="truncate text-[10px]"
        style={{ maxWidth: `${maxDisplayLength}px` }}
        title={currentName}
      >
        {currentName}
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="cursor-pointer truncate rounded px-1 text-[10px] hover:bg-muted"
          style={{ maxWidth: `${maxDisplayLength}px` }}
          title={currentName}
        >
          {currentName}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">物件名編集</h4>
            <p className="text-sm text-muted-foreground">
              物件名を編集できます
            </p>
          </div>
          <div className="grid gap-2">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="物件名を入力してください"
              maxLength={200}
              autoFocus
            />
            <div className="text-right text-xs text-muted-foreground">
              {value.length} / 200
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
              disabled={isSaving || !value.trim()}
            >
              {isSaving ? "保存中..." : "保存"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
