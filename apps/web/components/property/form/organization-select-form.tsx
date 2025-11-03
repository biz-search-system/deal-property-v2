"use client";

import { Organization } from "@/lib/types/organization";
import {
  ORGANIZATION_COLORS,
  ORGANIZATION_LABELS,
  OrganizationNameType,
} from "@workspace/drizzle/constants";
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

export default function OrganizationSelectForm<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
  label = "管理組織",
  disabled = false,
  required = false,
  placeholder = "管理組織を選択",
  description,
  className,
  organizations,
  onValueChange,
}: {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  description?: string;
  className?: string;
  organizations: Organization[];
  onValueChange?: (value: string) => void;
}) {
  // 選択された組織を取得
  const selectedOrganizationId = form.watch(name);
  const selectedOrganization = organizations.find(
    (org) => org.id === selectedOrganizationId
  );

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
            onValueChange={(value) => {
              field.onChange(value);
              onValueChange?.(value);
            }}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder}>
                  {selectedOrganization && (
                    <OrganizationBadge
                      organizationName={
                        selectedOrganization.name as OrganizationNameType
                      }
                    />
                  )}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {organizations.map((org) => {
                const organizationName = org.name as OrganizationNameType;
                return (
                  <SelectItem key={org.id} value={org.id}>
                    <OrganizationBadge organizationName={organizationName} />
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// バッジコンポーネントを分離して再利用可能にする
export function OrganizationBadge({
  organizationName,
}: {
  organizationName: OrganizationNameType;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("text-xs", ORGANIZATION_COLORS[organizationName])}
    >
      {ORGANIZATION_LABELS[organizationName]}
    </Badge>
  );
}
