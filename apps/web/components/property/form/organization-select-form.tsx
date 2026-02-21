"use client";

import { Organization } from "@/lib/types/organization";
import { OrganizationSlugType } from "@workspace/utils";
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
import { Button } from "@workspace/ui/components/button";
import { X } from "lucide-react";
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import OrganizationBadge from "../badge/organization-badge";

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
              onValueChange={(value) => {
                field.onChange(value);
                onValueChange?.(value);
              }}
              disabled={disabled}
            >
              <SelectTrigger
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="w-1/2"
              >
                <SelectValue placeholder={placeholder}>
                  {selectedOrganization && (
                    <OrganizationBadge
                      organizationSlug={
                        selectedOrganization.slug as OrganizationSlugType
                      }
                      size="medium"
                    />
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => {
                  const organizationSlug = org.slug as OrganizationSlugType;
                  return (
                    <SelectItem key={org.id} value={org.id}>
                      <OrganizationBadge
                        organizationSlug={organizationSlug}
                        size="medium"
                      />
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                field.onChange("");
                onValueChange?.("");
              }}
              disabled={disabled}
              className={!field.value || required ? "invisible" : ""}
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
