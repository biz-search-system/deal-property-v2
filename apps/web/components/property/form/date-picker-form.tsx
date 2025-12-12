"use client";

import { useState } from "react";
import { format, endOfMonth } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/utils";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { UserActionBadge } from "../user-action-badge";

interface UserInfo {
  name: string | null;
  email: string;
  image: string | null;
}

interface DatePickerFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  updatedAt?: Date | null;
  updatedByUser?: UserInfo | null;
}

export default function DatePickerForm<T extends FieldValues>({
  form,
  name,
  label,
  updatedAt,
  updatedByUser,
}: DatePickerFormProps<T>) {
  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  // 月末判定（午前0時0分10秒かつ月末日の場合）
  const isMonthEndDate = (dateValue: string | null | undefined): boolean => {
    if (!dateValue) return false;
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return false;

    return (
      date.getHours() === 0 &&
      date.getMinutes() === 0 &&
      date.getSeconds() === 10 &&
      date.getMilliseconds() === 0 &&
      date.getDate() === endOfMonth(date).getDate()
    );
  };

  // 日付を表示用にフォーマット
  const formatDisplayDate = (dateValue: string | null | undefined): string => {
    if (!dateValue) return "日付を選択";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "日付を選択";

    if (isMonthEndDate(dateValue)) {
      return `${date.getMonth() + 1}月末`;
    }

    return format(date, "yyyy/MM/dd(E)", { locale: ja });
  };

  // 日付文字列をDate型に変換（カレンダー表示用）
  const parseDate = (
    dateValue: string | null | undefined
  ): Date | undefined => {
    if (!dateValue) return undefined;
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? undefined : date;
  };

  // 日付を YYYY-MM-DD 形式の文字列に変換
  const formatToDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 月末予定用の日付文字列を生成（午前0時0分10秒）
  const formatMonthEndDateString = (date: Date): string => {
    const monthEnd = endOfMonth(date);
    const year = monthEnd.getFullYear();
    const month = String(monthEnd.getMonth() + 1).padStart(2, "0");
    const day = String(monthEnd.getDate()).padStart(2, "0");
    // ISO形式で時刻を含める（00:00:10）
    return `${year}-${month}-${day}T00:00:10`;
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    type="button"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {formatDisplayDate(field.value)}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                  {updatedAt && (
                    <div className="flex justify-end">
                      <UserActionBadge
                        timestamp={updatedAt}
                        user={updatedByUser}
                      />
                    </div>
                  )}
                </div>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {/* ヘッダー */}
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <span className="text-sm font-medium">{label}</span>
                <div className="flex gap-1">
                  {/* 月末予定ボタン */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const monthEndStr =
                        formatMonthEndDateString(selectedMonth);
                      field.onChange(monthEndStr);
                      setOpen(false);
                    }}
                    className="h-7 px-2 text-xs"
                  >
                    月末予定
                  </Button>
                  {/* クリアボタン */}
                  {field.value && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        field.onChange("");
                        setOpen(false);
                      }}
                      className="h-7 px-2 text-xs"
                    >
                      クリア
                    </Button>
                  )}
                </div>
              </div>

              {/* カレンダー */}
              <Calendar
                mode="single"
                selected={parseDate(field.value)}
                onSelect={(date) => {
                  if (date) {
                    field.onChange(formatToDateString(date));
                  }
                  setOpen(false);
                }}
                month={selectedMonth}
                onMonthChange={setSelectedMonth}
                locale={ja}
                className="p-3"
                captionLayout="dropdown"
                startMonth={new Date(new Date().getFullYear() - 5, 0)}
                endMonth={new Date(new Date().getFullYear() + 5, 11)}
              />
            </PopoverContent>
          </Popover>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
