"use client";

import { Badge } from "@workspace/ui/components/badge";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/utils";
import { X } from "lucide-react";
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

export type BadgeSelectOption<T extends string = string> = {
  value: T;
  label: string;
  color?: string;
};

export default function BadgeSelectForm<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue extends string = string,
>({
  form,
  name,
  label,
  disabled = false,
  required = false,
  placeholder = "選択してください",
  description,
  className,
  options,
  updatedAt,
  updatedByUser,
}: {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  description?: string;
  className?: string;
  options: BadgeSelectOption<TValue>[];
  updatedAt?: Date | null;
  updatedByUser?: UserInfo | null;
}) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedOption = options.find(
          (option) => option.value === field.value,
        );

        return (
          <Field
            data-invalid={fieldState.invalid}
            data-disabled={disabled}
            className={cn("@container/badge-select-form", className)}
          >
            {label && (
              <FieldLabel htmlFor={field.name} className="select-text">
                {label}
                {/* {required && <span className="text-destructive ml-1">*</span>} */}
              </FieldLabel>
            )}
            <div className="flex flex-row justify-between @[382px]/badge-select-form:grid @[382px]/badge-select-form:grid-cols-2 @[382px]/badge-select-form:gap-4">
              <div className="flex items-center gap-1 w-4/9 @[382px]/badge-select-form:w-full">
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <SelectTrigger
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder={placeholder}>
                      {selectedOption && (
                        <Badge
                          variant="outline"
                          className={cn("text-xs", selectedOption.color)}
                        >
                          {selectedOption.label}
                        </Badge>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <Badge
                            variant="outline"
                            className={cn("text-xs", option.color)}
                          >
                            {option.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => field.onChange("")}
                  disabled={disabled}
                  className={cn((!field.value || required) && "hidden")}
                  aria-label="選択を解除"
                >
                  <X />
                </Button>
              </div>
              {updatedAt && (
                <div className="flex justify-end">
                  <UserActionBadge timestamp={updatedAt} user={updatedByUser} />
                </div>
              )}
            </div>
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
