"use client";

import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Button } from "@workspace/ui/components/button";
import { X } from "lucide-react";
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

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  updatedAt?: Date | null;
  updatedByUser?: UserInfo | null;
}

export default function SelectForm<T extends FieldValues>({
  form,
  name,
  label,
  options,
  placeholder = "選択してください",
  required = false,
  updatedAt,
  updatedByUser,
}: SelectFormProps<T>) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          className="@container/select-form"
        >
          <FieldLabel htmlFor={field.name} className="select-text">
            {label}
          </FieldLabel>
          <div className="flex flex-row justify-between @[382px]/select-form:grid @[382px]/select-form:grid-cols-2 @[382px]/select-form:gap-4">
            <div className="flex items-center gap-1">
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  className="w-4/9 @[382px]/select-form:w-full"
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => field.onChange("")}
                className={!field.value || required ? "invisible" : ""}
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
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
