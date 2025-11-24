"use client";

import { useState } from "react";
import { format, endOfMonth } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { updatePropertySettlementDate } from "@/lib/actions/property";
import { toast } from "sonner";
import { cn } from "@workspace/utils";

interface SettlementDatePopoverEditProps {
  propertyId: string;
  currentDate: Date | string | null;
  // カスタムの保存処理（指定しない場合はデフォルトのサーバーアクションを使用）
  onSave?: (propertyId: string, newDate: Date | null) => void | Promise<void>;
  // 編集可能かどうか
  editable?: boolean;
  // 表示フォーマット関数（指定しない場合はデフォルトフォーマットを使用）
  formatDisplay?: (date: Date | string | null) => string;
}

export function SettlementDatePopoverEdit({
  propertyId,
  currentDate,
  onSave,
  editable = true,
  formatDisplay,
}: SettlementDatePopoverEditProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Date>(
    currentDate ? new Date(currentDate) : new Date(),
  );

  // デフォルトの日付フォーマット（曜日付き）
  const defaultFormatDisplay = (dateValue: Date | string | null): string => {
    if (!dateValue) return "-";
    const date =
      typeof dateValue === "string" ? new Date(dateValue) : dateValue;

    // 無効な日付チェック
    if (isNaN(date.getTime())) return "-";

    // 曜日付きフォーマット（例: 2024/11/22(金)）
    return format(date, "yyyy/MM/dd(E)", { locale: ja });
  };

  // 表示用フォーマット関数の決定
  const displayFormatter = formatDisplay || defaultFormatDisplay;

  // 日付を選択して即座に保存
  const handleDateSelect = async (date: Date | undefined) => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(propertyId, date || null);
      } else {
        // デフォルトのサーバーアクション
        await updatePropertySettlementDate({
          id: propertyId,
          settlementDate: date || null,
        });
        toast.success("決済日を更新しました");
      }
      setOpen(false);
    } catch (error) {
      toast.error("決済日の更新に失敗しました");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // 月末日を設定
  const handleSetMonthEnd = async () => {
    const monthEnd = endOfMonth(selectedMonth);
    await handleDateSelect(monthEnd);
  };

  // 日付をクリア
  const handleClearDate = async () => {
    await handleDateSelect(undefined);
  };

  // 編集不可の場合
  if (!editable) {
    return <div className="text-[10px]">{displayFormatter(currentDate)}</div>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-auto p-1 justify-start text-[10px] font-normal hover:bg-muted",
            !currentDate && "text-muted-foreground",
          )}
        >
          {displayFormatter(currentDate)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {/* ヘッダー部分をコンパクトに */}
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <span className="text-sm font-medium">決済日</span>
          <div className="flex gap-1">
            {/* 月末ボタン */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSetMonthEnd}
              disabled={isSaving}
              className="h-7 px-2 text-xs"
            >
              月末
            </Button>
            {/* クリアボタン */}
            {currentDate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearDate}
                disabled={isSaving}
                className="h-7 px-2 text-xs"
              >
                クリア
              </Button>
            )}
          </div>
        </div>

        {/* カレンダー本体 - シンプルでクリーンなデザイン */}
        <Calendar
          mode="single"
          selected={currentDate ? new Date(currentDate) : undefined}
          onSelect={handleDateSelect}
          month={selectedMonth}
          onMonthChange={setSelectedMonth}
          disabled={isSaving}
          locale={ja}
          className="p-3"
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
}
