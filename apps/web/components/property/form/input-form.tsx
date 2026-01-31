"use client";

import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";

interface InputFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  type?: "text" | "number" | "email" | "tel" | "url";
  autoComplete?: string;
  className?: string;
}

export default function InputForm<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
  label,
  placeholder,
  disabled = false,
  required = false,
  type = "text",
  autoComplete = "off",
  className,
}: InputFormProps<TFieldValues, TName>) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          data-disabled={disabled}
          className={className}
        >
          <FieldLabel htmlFor={field.name} className="select-text">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FieldLabel>
          <Input
            id={field.name}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            {...field}
            value={field.value ?? ""}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
