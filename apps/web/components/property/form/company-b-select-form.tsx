"use client";

import { COMPANY_B_COLORS, COMPANY_B_LABELS } from "@workspace/utils";
import { companyB } from "@workspace/drizzle/schemas";
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
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
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
            </FormControl>
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
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
