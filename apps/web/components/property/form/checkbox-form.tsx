"use client";

import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Label } from "@workspace/ui/components/label";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
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
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                />
                <Label className="cursor-pointer">{label}</Label>
              </div>
              {updatedAt && (
                <UserActionBadge timestamp={updatedAt} user={updatedByUser} />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
