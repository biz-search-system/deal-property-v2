"use client";

import { Badge } from "@workspace/ui/components/badge";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { cn } from "@workspace/utils";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { UserActionBadge } from "../user-action-badge";

interface UserInfo {
  name: string | null;
  email: string;
  image: string | null;
}

export type BadgeToggleOption<T extends string = string> = {
  value: T;
  label: string;
  color?: string;
};

interface BadgeToggleFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue extends string = string,
> {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  label?: string;
  disabled?: boolean;
  options: BadgeToggleOption<TValue>[];
  updatedAt?: Date | null;
  updatedByUser?: UserInfo | null;
}

export default function BadgeToggleForm<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue extends string = string,
>({
  form,
  name,
  label,
  disabled = false,
  options,
  updatedAt,
  updatedByUser,
}: BadgeToggleFormProps<TFieldValues, TName, TValue>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        // 現在の値のインデックスを取得（見つからない場合は-1）
        const currentIndex = options.findIndex(
          (option) => option.value === field.value
        );

        const handleBadgeClick = (clickedIndex: number) => {
          if (disabled) return;

          const clickedOption = options[clickedIndex];
          if (!clickedOption) return;

          // 現在選択中のバッジをクリックした場合は何もしない
          if (clickedIndex === currentIndex) return;

          // クリックしたバッジを選択
          field.onChange(clickedOption.value);
        };

        return (
          <FormItem className="flex flex-col">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-1 flex-wrap items-center">
                  {options.map((option, index) => {
                    const isSelected = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                      <Badge
                        key={option.value}
                        variant="outline"
                        className={cn(
                          "text-xs cursor-pointer transition-colors border",
                          isSelected && option.color,
                          !isSelected &&
                            "bg-muted/30 text-muted-foreground hover:bg-muted",
                          isCurrent && "ring-2 ring-offset-1 ring-primary/50",
                          disabled && "cursor-not-allowed opacity-50"
                        )}
                        onClick={() => handleBadgeClick(index)}
                      >
                        {option.label}
                      </Badge>
                    );
                  })}
                </div>
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
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
