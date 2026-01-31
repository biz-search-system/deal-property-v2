"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import {
  cn,
  NULLABLE_BOOLEAN_COLORS,
  NULLABLE_BOOLEAN_LABELS,
} from "@workspace/utils";
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
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
    {
      value: "null",
      label: NULLABLE_BOOLEAN_LABELS.null,
      color: NULLABLE_BOOLEAN_COLORS.null,
    },
  ];

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
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
          <Field data-invalid={fieldState.invalid} data-disabled={disabled}>
            {label && (
              <FieldLabel htmlFor={field.name} className="select-text">
                {label}
              </FieldLabel>
            )}
            <div
              role="radiogroup"
              id={field.name}
              aria-label={label}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex gap-1 flex-wrap items-center">
                {options.map((option) => {
                  const isSelected = option.value === currentValue;

                  return (
                    <Badge
                      key={option.value}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={disabled ? -1 : 0}
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleBadgeClick(option.value);
                        }
                      }}
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
