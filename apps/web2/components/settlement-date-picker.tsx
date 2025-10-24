"use client";

import * as React from "react";
import * as chrono from "chrono-node";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SettlementDatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
}

/**
 * 日付を日本語形式でフォーマット（曜日付き）
 */
function formatDateWithDay(date: Date | undefined): string {
  if (!date) {
    return "";
  }

  return format(date, "yyyy年M月d日(E)", { locale: ja });
}

/**
 * 「〇月予定」のパターンをチェック
 */
function isMonthScheduledPattern(text: string): {
  isMatch: boolean;
  year?: number;
  month?: number;
} {
  // 「3月予定」「2025年3月予定」などのパターン
  const patterns = [
    /^(\d{4})年(\d{1,2})月予定$/,
    /^(\d{1,2})月予定$/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      if (match[1] && match[2]) {
        // 年月両方指定
        return {
          isMatch: true,
          year: parseInt(match[1]),
          month: parseInt(match[2]),
        };
      } else if (match[1]) {
        // 月のみ指定（現在年を使用）
        return {
          isMatch: true,
          year: new Date().getFullYear(),
          month: parseInt(match[1]),
        };
      }
    }
  }

  return { isMatch: false };
}

/**
 * 日本語対応のchrono-nodeカスタムパーサー
 */
const customChrono = chrono.ja.casual.clone();

export function SettlementDatePicker({
  value = "",
  onChange,
  label = "決済日",
  placeholder = "例: 2025年3月15日、3月予定",
}: SettlementDatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const [date, setDate] = React.useState<Date | undefined>(() => {
    if (!value) return undefined;
    const parsed = customChrono.parseDate(value);
    return parsed || undefined;
  });
  const [month, setMonth] = React.useState<Date | undefined>(date);

  // 入力値の変更ハンドラー
  const handleInputChange = (text: string) => {
    setInputValue(text);

    // 「〇月予定」パターンのチェック
    const scheduledPattern = isMonthScheduledPattern(text);

    if (scheduledPattern.isMatch && scheduledPattern.year && scheduledPattern.month) {
      // 月予定の場合は月末日を設定
      const lastDay = new Date(scheduledPattern.year, scheduledPattern.month, 0);
      setDate(lastDay);
      setMonth(lastDay);
      onChange?.(text); // 元のテキストを保存
      return;
    }

    // 通常の日付パース
    const parsed = customChrono.parseDate(text);
    if (parsed) {
      setDate(parsed);
      setMonth(parsed);
      onChange?.(text);
    } else {
      // パースできない場合もテキストは保存
      onChange?.(text);
    }
  };

  // カレンダーから選択したときのハンドラー
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    setDate(selectedDate);
    const formatted = formatDateWithDay(selectedDate);
    setInputValue(formatted);
    onChange?.(formatted);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="settlement-date" className="px-1">
        {label}
      </Label>
      <div className="relative flex gap-2">
        <Input
          id="settlement-date"
          value={inputValue}
          placeholder={placeholder}
          className="bg-background pr-10"
          autoComplete="off"
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">カレンダーを開く</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleDateSelect}
              locale={ja}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
