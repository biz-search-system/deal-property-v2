"use client";

import { useState, useEffect } from "react";
import { Field, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { usePropertyForm } from "../property-form-provider";
import CompanyBSelectForm from "../form/company-b-select-form";
import BrokerCompanySelectForm from "../form/broker-company-select-form";
import BadgeSelectForm from "../form/badge-select-form";
import ComboboxForm from "../form/combobox-form";
import InputForm from "../form/input-form";
import AmountInputForm from "../form/amount-input-form";
import TextareaForm from "../form/textarea-form";
import OrganizationSelectForm from "../form/organization-select-form";
import StaffSelectForm from "../form/staff-select-form";
import { Organization } from "@/lib/types/organization";
import { contractType } from "@workspace/drizzle/schemas";
import { CONTRACT_TYPE_COLORS, CONTRACT_TYPE_LABELS } from "@workspace/utils";
import SectionCard from "../section-card";
import { useSelectOptions } from "@/lib/swr/select-option";
import {
  createSelectOption,
  deleteSelectOption,
} from "@/lib/actions/select-option";
import { SalesTeamMember } from "@/lib/types/team";

interface BasicInfoTabProps {
  availableStaff: SalesTeamMember[];
  organizations?: Organization[];
}

export default function BasicInfoTab({
  availableStaff: initialStaff,
  organizations = [],
}: BasicInfoTabProps) {
  const form = usePropertyForm();
  const { watch, setValue } = form;
  const [availableStaff, setAvailableStaff] = useState(initialStaff);
  const contractTypeValue = watch("contractType");

  // 違約の場合は金額フィールドを0にして非活性にする
  const isIyaku = contractTypeValue === "iyaku";

  // 違約に変更されたときに金額を0にリセット
  useEffect(() => {
    if (isIyaku) {
      setValue("amountA", 0);
      setValue("amountExit", 0);
      setValue("commission", 0);
      setValue("bcDeposit", 0);
    }
  }, [isIyaku, setValue]);

  // セレクトオプションの取得（全組織共通）
  const {
    options: buyerCompanyOptions,
    mutate: mutateBuyerCompany,
    isLoading: isLoadingBuyerCompany,
  } = useSelectOptions("buyer_company");
  const {
    options: mortgageBankOptions,
    mutate: mutateMortgageBank,
    isLoading: isLoadingMortgageBank,
  } = useSelectOptions("mortgage_bank");

  // 買取業者の追加
  const handleAddBuyerCompany = async (value: string) => {
    await createSelectOption({
      category: "buyer_company",
      value,
    });
    mutateBuyerCompany();
  };

  // 買取業者の削除
  const handleDeleteBuyerCompany = async (id: string) => {
    await deleteSelectOption(id);
    mutateBuyerCompany();
  };

  // 抵当銀行の追加
  const handleAddMortgageBank = async (value: string) => {
    await createSelectOption({
      category: "mortgage_bank",
      value,
    });
    mutateMortgageBank();
  };

  // 抵当銀行の削除
  const handleDeleteMortgageBank = async (id: string) => {
    await deleteSelectOption(id);
    mutateMortgageBank();
  };

  // 組織変更時の処理
  const handleOrganizationChange = async (newOrganizationId: string) => {
    setValue("organizationId", newOrganizationId);

    // 営業チームメンバーを再取得
    try {
      const response = await fetch(
        `/api/organization/${newOrganizationId}/sales-team`
      );
      if (response.ok) {
        const data = await response.json();
        setAvailableStaff(data.members || []);
        // 選択済みスタッフをクリア
        setValue("staffIds", []);
      }
    } catch (error) {
      console.error("Failed to fetch sales team members:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* 組織情報 */}
      {organizations.length > 0 && (
        <SectionCard title="組織情報">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 w-full">
            {/* 管理組織 */}
            <OrganizationSelectForm
              form={form}
              name="organizationId"
              organizations={organizations}
              onValueChange={handleOrganizationChange}
              required={true}
            />

            {/* 担当営業 */}
            <StaffSelectForm
              form={form}
              name="staffIds"
              availableStaff={availableStaff}
            />
          </div>
        </SectionCard>
      )}

      {/* 物件情報 */}
      <SectionCard title="物件情報">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 w-full">
          <InputForm
            form={form}
            name="propertyName"
            label="物件名"
            placeholder="物件名を入力"
          />

          <InputForm
            form={form}
            name="roomNumber"
            label="号室"
            placeholder="号室を入力"
          />

          <InputForm
            form={form}
            name="ownerName"
            label="オーナー名"
            placeholder="オーナー名を入力"
          />
        </div>
      </SectionCard>

      {/* 金額情報 */}
      <SectionCard title="金額情報">
        <p className="text-xs text-muted-foreground mb-4">
          ※ 入力は万円単位です。DBには円単位で保存されます。
          {isIyaku && (
            <span className="text-destructive ml-2">
              （違約のため金額フィールドは0固定です）
            </span>
          )}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 w-full">
          <AmountInputForm
            form={form}
            name="amountA"
            label="A金額（万円）"
            disabled={isIyaku}
          />

          <AmountInputForm
            form={form}
            name="amountExit"
            label="出口金額（万円）"
            disabled={isIyaku}
          />

          <AmountInputForm
            form={form}
            name="commission"
            label="仲手等（万円）"
            disabled={isIyaku}
          />

          {/* 利益 - 違約の場合は手動入力、それ以外は自動計算 */}
          {isIyaku ? (
            <AmountInputForm
              form={form}
              name="profit"
              label="利益（万円）"
              placeholder="利益を入力"
            />
          ) : (
            <Field>
              <div className="flex flex-row justify-between gap-2">
                <FieldLabel>利益（自動計算）</FieldLabel>
                <p className="text-xs text-muted-foreground">
                  出口金額 - A金額 + 仲手等
                </p>
              </div>
              <Input
                readOnly
                className="bg-muted font-semibold text-green-600"
                value={(() => {
                  const amountA = watch("amountA") || 0;
                  const amountExit = watch("amountExit") || 0;
                  const commission = watch("commission") || 0;
                  const profit = amountExit - amountA + commission;
                  return profit !== 0 ? `${profit.toLocaleString()}万円` : "-";
                })()}
              />
            </Field>
          )}

          <AmountInputForm
            form={form}
            name="bcDeposit"
            label="BC手付（万円）"
            disabled={isIyaku}
          />
        </div>
      </SectionCard>

      {/* 契約情報 */}
      <SectionCard title="契約情報">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 w-full">
          <ComboboxForm
            form={form}
            name="buyerCompany"
            label="買取業者"
            placeholder="選択または入力"
            searchPlaceholder="業者名を検索..."
            emptyMessage="該当する業者がありません"
            options={buyerCompanyOptions.map((opt) => ({
              id: opt.id,
              value: opt.value,
              label: opt.value,
            }))}
            isLoading={isLoadingBuyerCompany}
            onAddOption={handleAddBuyerCompany}
            onDeleteOption={handleDeleteBuyerCompany}
          />

          <BadgeSelectForm
            form={form}
            name="contractType"
            label="契約形態"
            options={contractType.map((type) => ({
              value: type,
              label: CONTRACT_TYPE_LABELS[type],
              color: CONTRACT_TYPE_COLORS[type],
            }))}
          />

          <CompanyBSelectForm form={form} name="companyB" label="B会社" />

          <BrokerCompanySelectForm
            form={form}
            name="brokerCompany"
            label="仲介会社"
          />

          <ComboboxForm
            form={form}
            name="mortgageBank"
            label="抵当銀行"
            placeholder="選択または入力"
            searchPlaceholder="銀行名を検索..."
            emptyMessage="該当する銀行がありません"
            options={mortgageBankOptions.map((opt) => ({
              id: opt.id,
              value: opt.value,
              label: opt.value,
            }))}
            isLoading={isLoadingMortgageBank}
            onAddOption={handleAddMortgageBank}
            onDeleteOption={handleDeleteMortgageBank}
          />

          <InputForm
            form={form}
            name="listType"
            label="名簿種別"
            placeholder="名簿種別を入力"
          />
        </div>
      </SectionCard>

      {/* 備考 */}
      <SectionCard title="備考">
        <TextareaForm
          form={form}
          name="notes"
          placeholder="備考を入力"
          className="w-full"
        />
      </SectionCard>
    </div>
  );
}
