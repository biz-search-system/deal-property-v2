"use client";

import { useState } from "react";
import { ja } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  cn,
  createMonthEndDate,
  formatDateWithMonthEnd,
} from "@workspace/utils";
import {
  Controller,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";
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
  /** 時間選択を有効にする */
  showTime?: boolean;
  updatedAt?: Date | null;
  updatedByUser?: UserInfo | null;
}

export default function DatePickerForm<T extends FieldValues>({
  form,
  name,
  label,
  showTime = false,
  updatedAt,
  updatedByUser,
}: DatePickerFormProps<T>) {
  const [open, setOpen] = useState(false);
  const currentValue = form.watch(name);
  const [selectedMonth, setSelectedMonth] = useState<Date>(
    currentValue ? new Date(currentValue) : new Date(),
  );

  // 日付を表示用にフォーマット
  const formatDisplayDate = (dateValue: string | null | undefined): string => {
    if (!dateValue) return showTime ? "日時を選択" : "日付を選択";
    if (showTime) {
      const d = new Date(dateValue);
      if (isNaN(d.getTime())) return showTime ? "日時を選択" : "日付を選択";
      const dateStr = formatDateWithMonthEnd(dateValue);
      if (dateStr === "-") return "日時を選択";
      const h = String(d.getHours()).padStart(2, "0");
      const m = String(d.getMinutes()).padStart(2, "0");
      return `${dateStr} ${h}:${m}`;
    }
    const result = formatDateWithMonthEnd(dateValue);
    return result === "-" ? "日付を選択" : result;
  };

  // 日付文字列をDate型に変換（カレンダー表示用）
  const parseDate = (
    dateValue: string | null | undefined,
  ): Date | undefined => {
    if (!dateValue) return undefined;
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? undefined : date;
  };

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          className="@container/date-picker-form"
        >
          <FieldLabel htmlFor={field.name} className="select-text">
            {label}
          </FieldLabel>
          <div className="flex flex-row justify-between @[382px]/date-picker-form:grid @[382px]/date-picker-form:grid-cols-2 @[382px]/date-picker-form:gap-4">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  id={field.name}
                  variant="outline"
                  type="button"
                  aria-invalid={fieldState.invalid}
                  className={cn(
                    "w-4/9 @[382px]/date-picker-form:w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {formatDisplayDate(field.value)}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                {/* ヘッダー */}
                <div className="flex items-center justify-between px-3 py-2 border-b gap-3">
                  <span className="text-sm font-medium">{label}</span>
                  <div className="flex gap-1">
                    {/* 月末予定ボタン */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const monthEndDate = createMonthEndDate(selectedMonth);
                        field.onChange(monthEndDate.toISOString());
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
                    // 同じ日付を選択した場合、react-day-pickerはundefinedを返すことがある
                    // その場合は現在の日付を使用して「月末予定」から「通常日付」に更新する
                    let selectedDate = date;
                    if (!selectedDate && field.value) {
                      selectedDate = new Date(field.value);
                    }

                    if (selectedDate) {
                      if (showTime && field.value) {
                        // 時間モード: 既存の時・分を保持
                        const prev = new Date(field.value);
                        if (!isNaN(prev.getTime())) {
                          selectedDate.setHours(
                            prev.getHours(),
                            prev.getMinutes(),
                            0,
                            0,
                          );
                        } else {
                          selectedDate.setHours(10, 0, 0, 0);
                        }
                      } else if (showTime) {
                        // 時間モード: 初期値 10:00
                        selectedDate.setHours(10, 0, 0, 0);
                      } else {
                        // 通常の日付選択: 午前0時0分0秒
                        selectedDate.setHours(0, 0, 0, 0);
                      }
                      field.onChange(selectedDate.toISOString());
                    }
                    if (!showTime) setOpen(false);
                  }}
                  month={selectedMonth}
                  onMonthChange={setSelectedMonth}
                  locale={ja}
                  className="w-full p-3"
                  captionLayout="dropdown"
                  startMonth={new Date(new Date().getFullYear() - 5, 0)}
                  endMonth={new Date(new Date().getFullYear() + 5, 11)}
                  required
                />

                {/* 時間選択 */}
                {showTime && field.value && (
                  <div className="flex items-center justify-between border-t px-3 py-2">
                    <span className="text-xs text-muted-foreground">時間</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={(() => {
                          const d = new Date(field.value);
                          if (isNaN(d.getTime())) return "10:00";
                          const h = String(d.getHours()).padStart(2, "0");
                          const m = String(d.getMinutes()).padStart(2, "0");
                          return `${h}:${m}`;
                        })()}
                        onChange={(e) => {
                          const parts = e.target.value.split(":");
                          const h = Number(parts[0] ?? 0);
                          const m = Number(parts[1] ?? 0);
                          const d = new Date(field.value);
                          d.setHours(h, m, 0, 0);
                          field.onChange(d.toISOString());
                        }}
                        className="h-8 w-fit rounded-md border bg-background px-2 text-sm appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpen(false)}
                        className="h-7 px-2 text-xs"
                      >
                        閉じる
                      </Button>
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            {updatedAt && (
              <div className="flex justify-end">
                <UserActionBadge timestamp={updatedAt} user={updatedByUser} />
              </div>
            )}
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
