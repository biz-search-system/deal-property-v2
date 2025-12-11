"use client";

import {
  FormControl,
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
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
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
  updatedAt?: Date | null;
  updatedByUser?: UserInfo | null;
}

export default function SelectForm<T extends FieldValues>({
  form,
  name,
  label,
  options,
  placeholder = "選択してください",
  updatedAt,
  updatedByUser,
}: SelectFormProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col @container/select-form">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex flex-row justify-between @[382px]/select-form:grid @[382px]/select-form:grid-cols-2 ">
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-4/9 @[382px]/select-form:w-full">
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
              {updatedAt && (
                <div className="flex justify-end">
                  <UserActionBadge timestamp={updatedAt} user={updatedByUser} />
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
