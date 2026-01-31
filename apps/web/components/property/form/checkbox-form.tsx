"use client";

import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field";
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

interface CheckboxFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  label: string;
  disabled?: boolean;
  updatedAt?: Date | null;
  updatedByUser?: UserInfo | null;
}

export default function CheckboxForm<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
  label,
  disabled = false,
  updatedAt,
  updatedByUser,
}: CheckboxFormProps<TFieldValues, TName>) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          orientation="horizontal"
          data-invalid={fieldState.invalid}
          data-disabled={disabled}
          className="justify-between py-2"
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={field.name}
              name={field.name}
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
            />
            <FieldLabel
              htmlFor={field.name}
              className="cursor-pointer select-text"
            >
              {label}
            </FieldLabel>
          </div>
          {updatedAt && (
            <UserActionBadge timestamp={updatedAt} user={updatedByUser} />
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
