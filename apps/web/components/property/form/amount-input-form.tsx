"use client";

import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";

interface AmountInputFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  step?: number;
  className?: string;
}

export default function AmountInputForm<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
  label,
  placeholder = "金額を入力",
  disabled = false,
  min = 0,
  step = 0.01,
  className,
}: AmountInputFormProps<TFieldValues, TName>) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field: { value, onChange, ...field }, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          data-disabled={disabled}
          className={className}
        >
          <FieldLabel htmlFor={field.name} className="select-text">
            {label}
          </FieldLabel>
          <Input
            id={field.name}
            type="number"
            min={min}
            step={step}
            placeholder={placeholder}
            autoComplete="off"
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            {...field}
            value={value ?? ""}
            onChange={(e) => {
              const num = Number(e.target.value);
              onChange(e.target.value === "" ? null : num < 0 ? 0 : num);
            }}
            onWheel={(e) => e.currentTarget.blur()}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
