"use client";

import { BROKER_COMPANY_COLORS, BROKER_COMPANY_LABELS } from "@workspace/utils";
import { brokerCompany } from "@workspace/drizzle/schemas";
import { BrokerCompany } from "@workspace/drizzle/types";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import BadgeSelectForm, { BadgeSelectOption } from "./badge-select-form";

export default function BrokerCompanySelectForm<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
  label = "仲介会社",
  disabled = false,
  required = false,
  placeholder = "仲介会社を選択",
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
  const options: BadgeSelectOption<BrokerCompany>[] = brokerCompany.map(
    (company) => ({
      value: company,
      label: BROKER_COMPANY_LABELS[company],
      color: BROKER_COMPANY_COLORS[company],
    }),
  );

  return (
    <BadgeSelectForm
      form={form}
      name={name}
      label={label}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      description={description}
      className={className}
      options={options}
    />
  );
}
