"use client";

import InputForm from "@/components/property/form/input-form";
import AmountInputForm from "@/components/property/form/amount-input-form";
import { useExitForm } from "../exit-form-provider";
import { Field, FieldLabel } from "@workspace/ui/components/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Controller } from "react-hook-form";
import { SITUATION_LABELS, EXIT_STATUS_LABELS } from "@/lib/types/exit";
import type { Situation, ExitStatus } from "@/lib/types/exit";

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

/** 物件名フィールド */
export function PropertyNameField() {
  const form = useExitForm();
  return (
    <InputForm
      form={form}
      name="propertyName"
      label="物件名"
      placeholder="物件名を入力"
      required
    />
  );
}

/** 号室フィールド */
export function RoomNumberField() {
  const form = useExitForm();
  return (
    <InputForm
      form={form}
      name="roomNumber"
      label="号室"
      placeholder="号室を入力"
    />
  );
}

/** 住所フィールド */
export function AddressField() {
  const form = useExitForm();
  return (
    <InputForm
      form={form}
      name="address"
      label="住所"
      placeholder="住所を入力"
    />
  );
}

/** 築年月フィールド */
export function BuiltDateField() {
  const form = useExitForm();
  return (
    <InputForm
      form={form}
      name="builtDate"
      label="築年月"
      placeholder="2020-01"
    />
  );
}

/** 面積フィールド */
export function AreaField() {
  const form = useExitForm();
  return (
    <AmountInputForm
      form={form}
      name="area"
      label="面積（㎡）"
      placeholder="面積を入力"
      step={0.01}
    />
  );
}

/** 構造フィールド */
export function StructureField() {
  const form = useExitForm();
  return (
    <InputForm
      form={form}
      name="structure"
      label="構造"
      placeholder="RC造"
    />
  );
}

/** 階数フィールド */
export function FloorField() {
  const form = useExitForm();
  return (
    <InputForm
      form={form}
      name="floor"
      label="階数"
      placeholder="5/10"
    />
  );
}

/** 現況フィールド */
export function SituationField() {
  const form = useExitForm();
  return (
    <Controller
      control={form.control}
      name="situation"
      render={({ field }) => (
        <Field>
          <FieldLabel htmlFor={field.name}>現況</FieldLabel>
          <Select
            name={field.name}
            value={field.value || ""}
            onValueChange={(value) => field.onChange(value || null)}
          >
            <SelectTrigger id={field.name}>
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {SITUATION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
}

/** 家賃フィールド */
export function RentField() {
  const form = useExitForm();
  return (
    <AmountInputForm
      form={form}
      name="rent"
      label="家賃（円）"
      placeholder="家賃を入力"
      step={1}
    />
  );
}

/** 管理費フィールド */
export function ManagementFeeField() {
  const form = useExitForm();
  return (
    <AmountInputForm
      form={form}
      name="managementFee"
      label="管積（円）"
      placeholder="管理費を入力"
      step={1}
    />
  );
}

/** 仕入れ金額フィールド */
export function PurchasePriceField() {
  const form = useExitForm();
  return (
    <AmountInputForm
      form={form}
      name="purchasePrice"
      label="仕入れ金額（万円）"
      placeholder="仕入れ金額を入力"
      step={1}
    />
  );
}

/** マイソク価格フィールド */
export function MaisokuPriceField() {
  const form = useExitForm();
  return (
    <AmountInputForm
      form={form}
      name="maisokuPrice"
      label="マイソク価格（万円）"
      placeholder="マイソク価格を入力"
      step={1}
    />
  );
}

/** 想定利回りフィールド */
export function ExpectedYieldField() {
  const form = useExitForm();
  return (
    <AmountInputForm
      form={form}
      name="expectedYield"
      label="想定利回り（%）"
      placeholder="想定利回りを入力"
      step={0.01}
    />
  );
}

/** ステータスフィールド */
export function StatusField() {
  const form = useExitForm();
  return (
    <Controller
      control={form.control}
      name="status"
      render={({ field }) => (
        <Field>
          <FieldLabel htmlFor={field.name}>ステータス</FieldLabel>
          <Select
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger id={field.name}>
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
}

/** 備考フィールド */
export function NotesField() {
  const form = useExitForm();
  return (
    <InputForm
      form={form}
      name="notes"
      label="備考"
      placeholder="備考を入力"
    />
  );
}
