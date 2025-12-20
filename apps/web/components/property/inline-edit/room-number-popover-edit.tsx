"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { updatePropertyRoomNumber } from "@/lib/actions/property";

interface RoomNumberPopoverEditProps {
  propertyId: string;
  currentValue: string | null;
}

export function RoomNumberPopoverEdit({
  propertyId,
  currentValue,
}: RoomNumberPopoverEditProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentValue || "");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePropertyRoomNumber({
        id: propertyId,
        roomNumber: value.trim() || null,
      });
      toast.success("号室を更新しました");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("号室の更新に失敗しました");
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-auto max-w-full w-full p-1 justify-start text-[10px] font-normal transition-[color,box-shadow] hover:bg-transparent hover:ring-ring/50 hover:ring-[3px]",
            !currentValue && "text-muted-foreground"
          )}
        >
          <p className="truncate">{currentValue || "-"}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="grid gap-3">
          <div className="space-y-1">
            <h4 className="text-sm font-medium leading-none">号室編集</h4>
          </div>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="号室を入力"
            maxLength={20}
            className="h-8 text-sm"
            autoFocus
          />
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
