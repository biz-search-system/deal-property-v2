"use client";

import { Badge } from "@workspace/ui/components/badge";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { cn, NULLABLE_BOOLEAN_COLORS, NULLABLE_BOOLEAN_LABELS } from "@workspace/utils";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { UserActionBadge } from "../user-action-badge";

interface UserInfo {
  name: string | null;
  email: string;
  image: string | null;
}

interface NullableBooleanFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  label?: string;
  disabled?: boolean;
  updatedAt?: Date | null;
  updatedByUser?: UserInfo | null;
  /** true/falseのラベルをカスタマイズ */
  trueLabel?: string;
  falseLabel?: string;
}

/**
 * 三値（有/無/未設定）を選択するフォームコンポーネント
 * 権利証、住所変更、氏名変更などで使用
 */
export default function NullableBooleanForm<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
  label,
  disabled = false,
  updatedAt,
  updatedByUser,
  trueLabel = NULLABLE_BOOLEAN_LABELS.true,
  falseLabel = NULLABLE_BOOLEAN_LABELS.false,
}: NullableBooleanFormProps<TFieldValues, TName>) {
  const options = [
    { value: "true", label: trueLabel, color: NULLABLE_BOOLEAN_COLORS.true },
    { value: "false", label: falseLabel, color: NULLABLE_BOOLEAN_COLORS.false },
    { value: "null", label: NULLABLE_BOOLEAN_LABELS.null, color: NULLABLE_BOOLEAN_COLORS.null },
  ];

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        // field.valueをstringに変換
        const currentValue =
          field.value === true
            ? "true"
            : field.value === false
              ? "false"
              : "null";

        const handleBadgeClick = (clickedValue: string) => {
          if (disabled) return;
          if (clickedValue === currentValue) return;

          // stringをboolean | nullに変換
          const newValue =
            clickedValue === "true"
              ? true
              : clickedValue === "false"
                ? false
                : null;
          field.onChange(newValue);
        };

        return (
          <FormItem className="flex flex-col">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-1 flex-wrap items-center">
                  {options.map((option) => {
                    const isSelected = option.value === currentValue;

                    return (
                      <Badge
                        key={option.value}
                        variant="outline"
                        className={cn(
                          "text-xs cursor-pointer transition-colors border",
                          isSelected && option.color,
                          !isSelected &&
                            "bg-muted/30 text-muted-foreground hover:bg-muted",
                          isSelected && "ring-2 ring-offset-1 ring-primary/50",
                          disabled && "cursor-not-allowed opacity-50"
                        )}
                        onClick={() => handleBadgeClick(option.value)}
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
