"use client";

import { COMPANY_B_COLORS, COMPANY_B_LABELS } from "@workspace/utils";
import { companyB } from "@workspace/drizzle/schemas";
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
import { cn } from "@workspace/utils";
import { X } from "lucide-react";
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import { Button } from "@workspace/ui/components/button";

export default function CompanyBSelectForm<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
  label = "B会社",
  disabled = false,
  required = false,
  placeholder = "B会社を選択",
  description,
  className,
}: {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  description?: string;
  className?: string;
}) {
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
          {label && (
            <FieldLabel htmlFor={field.name} className="select-text">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FieldLabel>
          )}
          <div className="flex items-center gap-1">
            <Select
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="w-1/2"
              >
                <SelectValue placeholder={placeholder}>
                  {field.value && (
                    <Badge
                      variant="outline"
                      className={cn("text-xs", COMPANY_B_COLORS[field.value])}
                    >
                      {COMPANY_B_LABELS[field.value]}
                    </Badge>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {companyB.map((company) => (
                  <SelectItem key={company} value={company}>
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className={cn("text-xs", COMPANY_B_COLORS[company])}
                      >
                        {COMPANY_B_LABELS[company]}
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
              className={cn((!field.value || required) && "invisible")}
              aria-label="選択を解除"
            >
              <X />
            </Button>
          </div>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
