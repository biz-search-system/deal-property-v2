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
    currentDate ? new Date(currentDate) : new Date()
  );

  // デフォルトの日付フォーマット（月末判定付き）
  const defaultFormatDisplay = (dateValue: Date | string | null): string => {
    if (!dateValue) return "-";
    const date =
      typeof dateValue === "string" ? new Date(dateValue) : dateValue;

    // 無効な日付チェック
    if (isNaN(date.getTime())) return "-";

    // 月末判定（午前0時0分10秒かつ月末日の場合）
    const isMonthEnd =
      date.getHours() === 0 &&
      date.getMinutes() === 0 &&
      date.getSeconds() === 10 &&
      date.getMilliseconds() === 0 &&
      date.getDate() === endOfMonth(date).getDate();

    if (isMonthEnd) {
      // 月末表示（例: 11月末）
      return `${date.getMonth() + 1}月末予定`;
    }

    // 通常の曜日付きフォーマット（例: 2024/11/22(金)）
    return format(date, "yyyy/MM/dd(E)", { locale: ja });
  };

  // 表示用フォーマット関数の決定
  const displayFormatter = formatDisplay || defaultFormatDisplay;

  // 日付を指定時刻に設定するヘルパー関数
  const setDateTime = (
    date: Date,
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number = 0
  ): Date => {
    const result = new Date(date);
    result.setHours(hours, minutes, seconds, milliseconds);
    return result;
  };

  // 日付を保存する内部処理
  const saveDate = async (date: Date | null) => {
    if (onSave) {
      await onSave(propertyId, date);
    } else {
      // デフォルトのサーバーアクション
      await updatePropertySettlementDate({
        id: propertyId,
        settlementDate: date,
      });
      toast.success("決済日を更新しました");
    }
  };

  // 通常の日付を選択して保存（カレンダーから選択時）
  const handleDateSelect = async (date: Date | undefined) => {
    if (isSaving) return;

    // 同じ日付を選択した場合でも、dateが渡されていれば処理を続行
    // react-day-pickerは同じ日付を選択するとundefinedを返すことがあるが、
    // その場合は現在選択されている日付を使用する
    if (!date && currentDate) {
      // 同じ日付が選択された場合、現在の日付を再設定
      date = new Date(currentDate);
    }

    setIsSaving(true);
    try {
      let processedDate: Date | null = null;

      if (date) {
        // 通常の日付選択: 午前0時0分0秒
        processedDate = setDateTime(date, 0, 0, 0, 0);
      }

      await saveDate(processedDate);
      setOpen(false);
    } catch (error) {
      toast.error("決済日の更新に失敗しました");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // 月末予定を設定（午前0時0分10秒で保存）
  const handleSetMonthEnd = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const monthEnd = endOfMonth(selectedMonth);
      // 月末予定: 午前0時0分10秒
      const processedDate = setDateTime(monthEnd, 0, 0, 10, 0);

      await saveDate(processedDate);
      setOpen(false);
    } catch (error) {
      toast.error("決済日の更新に失敗しました");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // 日付をクリア
  const handleClearDate = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await saveDate(null);
      setOpen(false);
    } catch (error) {
      toast.error("決済日のクリアに失敗しました");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
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
            "h-auto max-w-full w-full p-1 justify-start text-[10px] font-normal transition-[color,box-shadow] hover:bg-transparent hover:ring-ring/50 hover:ring-[3px]",
            !currentDate && "text-muted-foreground"
          )}
        >
          <p className="truncate">{displayFormatter(currentDate)}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {/* ヘッダー部分をコンパクトに */}
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <span className="text-sm font-medium">決済日</span>
          <div className="flex gap-1">
            {/* 月末予定ボタン */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSetMonthEnd}
              disabled={isSaving}
              className="h-7 px-2 text-xs"
            >
              月末予定
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
          startMonth={new Date(new Date().getFullYear() - 5, 0)}
          endMonth={new Date(new Date().getFullYear() + 5, 11)}
          required
        />
      </PopoverContent>
    </Popover>
  );
}
