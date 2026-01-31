"use client";

import InputForm from "@/components/property/form/input-form";
import SelectForm from "@/components/property/form/select-form";
import CheckboxForm from "@/components/property/form/checkbox-form";
import { useBrokerForm } from "./broker-form-provider";
import SectionCard from "@/components/property/section-card";
import { Textarea } from "@workspace/ui/components/textarea";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Controller } from "react-hook-form";

const BROKER_TYPE_OPTIONS = [
  { value: "buyer", label: "買取業者" },
  { value: "broker", label: "買取仲介" },
];

export function BrokerFormFields() {
  const form = useBrokerForm();

  return (
    <div className="space-y-6">
      <SectionCard title="基本情報">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <InputForm
            form={form}
            name="name"
            label="業者名"
            placeholder="業者名を入力"
            required
          />
          <SelectForm
            form={form}
            name="brokerType"
            label="業者種別"
            options={BROKER_TYPE_OPTIONS}
          />
          <InputForm
            form={form}
            name="contactName"
            label="担当者名"
            placeholder="担当者名を入力"
          />
          <InputForm
            form={form}
            name="email"
            label="メールアドレス"
            placeholder="example@example.com"
            type="email"
            required
          />
          <InputForm
            form={form}
            name="phone"
            label="電話番号"
            placeholder="03-1234-5678"
            type="tel"
          />
          <InputForm
            form={form}
            name="address"
            label="住所"
            placeholder="住所を入力"
          />
        </div>
      </SectionCard>

      <SectionCard title="その他">
        <div className="grid grid-cols-1 gap-y-4">
          <Controller
            control={form.control}
            name="notes"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>備考</FieldLabel>
                <Textarea
                  id={field.name}
                  placeholder="備考を入力"
                  autoComplete="off"
                  rows={4}
                  {...field}
                  value={field.value ?? ""}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <CheckboxForm form={form} name="isActive" label="有効" />
        </div>
      </SectionCard>
    </div>
  );
}
