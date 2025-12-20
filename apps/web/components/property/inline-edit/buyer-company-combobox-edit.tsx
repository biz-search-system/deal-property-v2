"use client";

import { useSelectOptions } from "@/lib/swr/select-option";
import {
  createSelectOption,
  deleteSelectOption,
} from "@/lib/actions/select-option";
import { ComboboxPopoverEdit } from "./combobox-popover-edit";
import { updatePropertyBuyerCompany } from "@/lib/actions/property";

interface BuyerCompanyComboboxEditProps {
  propertyId: string;
  currentValue: string | null;
}

export function BuyerCompanyComboboxEdit({
  propertyId,
  currentValue,
}: BuyerCompanyComboboxEditProps) {
  const {
    options: buyerCompanyOptions,
    mutate: mutateBuyerCompany,
    isLoading,
  } = useSelectOptions("buyer_company");

  const handleSave = async (id: string, value: string | null) => {
    await updatePropertyBuyerCompany({
      id,
      buyerCompany: value,
    });
  };

  const handleAddOption = async (value: string) => {
    await createSelectOption({
      category: "buyer_company",
      value,
    });
    mutateBuyerCompany();
  };

  const handleDeleteOption = async (id: string) => {
    await deleteSelectOption(id);
    mutateBuyerCompany();
  };

  return (
    <ComboboxPopoverEdit
      id={propertyId}
      currentValue={currentValue}
      options={buyerCompanyOptions.map((opt) => ({
        id: opt.id,
        value: opt.value,
        label: opt.value,
      }))}
      onSave={handleSave}
      onAddOption={handleAddOption}
      onDeleteOption={handleDeleteOption}
      isLoading={isLoading}
      successMessage="買取会社を更新しました"
      errorMessage="買取会社の更新に失敗しました"
      searchPlaceholder="業者名を検索..."
      emptyMessage="該当する業者がありません"
    />
  );
}
