"use client";

import * as React from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MonthPickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

export function MonthPicker({ value, onChange }: MonthPickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setOpen(false);
    }
  };

  const handleToday = () => {
    onChange(new Date());
    setOpen(false);
  };

  const handlePreviousMonth = () => {
    const prevMonth = new Date(value);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    onChange(prevMonth);
    setOpen(false);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(value);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    onChange(nextMonth);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, "yyyy年M月", { locale: ja })
          ) : (
            <span>月を選択</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousMonth}
            >
              先月
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
            >
              来月
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="w-full"
          >
            今月
          </Button>
        </div>
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={value}
          onSelect={handleSelect}
          locale={ja}
          defaultMonth={value}
          startMonth={new Date(2020, 0)}
          endMonth={new Date(2030, 11)}
        />
      </PopoverContent>
    </Popover>
  );
}
