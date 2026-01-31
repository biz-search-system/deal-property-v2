"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { ChevronDown } from "lucide-react";
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import type { SalesTeamMember } from "@/lib/types/team";

interface StaffSelectFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  availableStaff: SalesTeamMember[];
}

export default function StaffSelectForm<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
  label = "担当営業",
  placeholder = "選択",
  disabled = false,
  availableStaff,
}: StaffSelectFormProps<TFieldValues, TName>) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedIds: string[] = field.value || [];

        const handleToggle = (staffId: string, checked: boolean) => {
          if (checked) {
            field.onChange([...selectedIds, staffId]);
          } else {
            field.onChange(selectedIds.filter((id) => id !== staffId));
          }
        };

        return (
          <Field data-invalid={fieldState.invalid} data-disabled={disabled}>
            <FieldLabel htmlFor={field.name} className="select-text">
              {label}
            </FieldLabel>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  id={field.name}
                  variant="outline"
                  disabled={disabled}
                  aria-invalid={fieldState.invalid}
                  className="w-full justify-between"
                >
                  {selectedIds.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {availableStaff
                        .filter((staff) => selectedIds.includes(staff.userId))
                        .map((staff) => (
                          <Badge key={staff.userId} variant="outline">
                            {staff.users.name || "名前なし"}
                          </Badge>
                        ))}
                    </div>
                  ) : (
                    placeholder
                  )}
                  <ChevronDown className="shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72">
                <DropdownMenuLabel>営業チームメンバー</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableStaff.length > 0 ? (
                  availableStaff.map((staff) => (
                    <DropdownMenuCheckboxItem
                      key={staff.userId}
                      checked={selectedIds.includes(staff.userId)}
                      onCheckedChange={(checked) =>
                        handleToggle(staff.userId, checked)
                      }
                    >
                      <div className="flex flex-col">
                        <span>{staff.users.name || "名前なし"}</span>
                        {staff.users.email && (
                          <span className="text-xs text-muted-foreground">
                            {staff.users.email}
                          </span>
                        )}
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    営業チームのメンバーがいません
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
