"use client";

import AmountInputForm from "@/components/property/form/amount-input-form";
import InputForm from "@/components/property/form/input-form";
import SelectForm from "@/components/property/form/select-form";
import SectionCard from "@/components/property/section-card";
import { EXIT_STATUS_LABELS, SITUATION_LABELS } from "@/lib/types/exit";
import type { ExitStatus, Situation } from "@/lib/types/exit";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Textarea } from "@workspace/ui/components/textarea";
import { Controller } from "react-hook-form";
import { useExitForm } from "../exit-form-provider";

const SITUATION_OPTIONS: { value: Situation; label: string }[] = [
  { value: "renting", label: SITUATION_LABELS.renting },
  { value: "sublease", label: SITUATION_LABELS.sublease },
  { value: "vacant", label: SITUATION_LABELS.vacant },
];

const STATUS_OPTIONS: { value: ExitStatus; label: string }[] = [
  { value: "not_purchased", label: EXIT_STATUS_LABELS.not_purchased },
  { value: "waiting_purchase", label: EXIT_STATUS_LABELS.waiting_purchase },
  { value: "negotiating", label: EXIT_STATUS_LABELS.negotiating },
  { value: "confirmed", label: EXIT_STATUS_LABELS.confirmed },
  { value: "breach", label: EXIT_STATUS_LABELS.breach },
  { value: "troubled", label: EXIT_STATUS_LABELS.troubled },
];

export function ExitFormFields() {
  const form = useExitForm();

  return (
    <div className="space-y-6">
      <SectionCard title="物件情報">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <InputForm
            form={form}
            name="propertyName"
            label="物件名"
            placeholder="物件名を入力"
            required
          />
          <InputForm
            form={form}
            name="roomNumber"
            label="号室"
            placeholder="号室を入力"
          />
          <InputForm
            form={form}
            name="address"
            label="住所"
            placeholder="住所を入力"
          />
          <InputForm
            form={form}
            name="builtDate"
            label="築年月"
            placeholder="2020-01"
          />
          <AmountInputForm
            form={form}
            name="area"
            label="面積（㎡）"
            placeholder="面積を入力"
            step={0.01}
          />
          <InputForm
            form={form}
            name="structure"
            label="構造"
            placeholder="RC造"
          />
          <InputForm
            form={form}
            name="floor"
            label="階数"
            placeholder="5/10"
          />
        </div>
      </SectionCard>

      <SectionCard title="現況情報">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <SelectForm
            form={form}
            name="situation"
            label="現況"
            options={SITUATION_OPTIONS}
          />
          <AmountInputForm
            form={form}
            name="rent"
            label="家賃（円）"
            placeholder="家賃を入力"
            step={1}
          />
          <AmountInputForm
            form={form}
            name="managementFee"
            label="管積（円）"
            placeholder="管理費を入力"
            step={1}
          />
        </div>
      </SectionCard>

      <SectionCard title="金額情報">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <AmountInputForm
            form={form}
            name="purchasePrice"
            label="仕入れ金額（万円）"
            placeholder="仕入れ金額を入力"
            step={1}
          />
          <AmountInputForm
            form={form}
            name="maisokuPrice"
            label="マイソク価格（万円）"
            placeholder="マイソク価格を入力"
            step={1}
          />
          <AmountInputForm
            form={form}
            name="brokerageFee"
            label="仲手（万円）"
            placeholder="仲介手数料を入力"
            step={0.1}
          />
          <AmountInputForm
            form={form}
            name="expectedYield"
            label="想定利回り（%）"
            placeholder="想定利回りを入力"
            step={0.01}
          />
        </div>
      </SectionCard>

      <SectionCard title="ステータス・備考">
        <div className="grid grid-cols-1 gap-y-4">
          <SelectForm
            form={form}
            name="status"
            label="ステータス"
            options={STATUS_OPTIONS}
          />
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
        </div>
      </SectionCard>
    </div>
  );
}
