"use client";

import { Badge } from "@workspace/ui/components/badge";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/utils";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
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
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selectedOption = options.find(
          (option) => option.value === field.value
        );

        return (
          <FormItem className={cn("@container/badge-select-form", className)}>
            {label && (
              <FormLabel className="select-text">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <div className="flex flex-row justify-between @[382px]/badge-select-form:grid @[382px]/badge-select-form:grid-cols-2 @[382px]/badge-select-form:gap-4">
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger className="w-4/9 @[382px]/badge-select-form:w-full">
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
                </FormControl>
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
              {updatedAt && (
                <div className="flex justify-end">
                  <UserActionBadge timestamp={updatedAt} user={updatedByUser} />
                </div>
              )}
            </div>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
