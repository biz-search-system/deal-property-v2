"use client";

import { useState, useEffect } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { usePropertyForm } from "../property-form-provider";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { ChevronDown } from "lucide-react";
import CompanyBSelectForm from "../form/company-b-select-form";
import BrokerCompanySelectForm from "../form/broker-company-select-form";
import BadgeSelectForm from "../form/badge-select-form";
import ComboboxForm from "../form/combobox-form";
import OrganizationSelectForm from "../form/organization-select-form";
import {
  Organization,
  OrganizationWithUserRole,
} from "@/lib/types/organization";
import { contractType } from "@workspace/drizzle/schemas";
import { CONTRACT_TYPE_COLORS, CONTRACT_TYPE_LABELS } from "@workspace/utils";
import { Badge } from "@workspace/ui/components/badge";
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
  const { control, watch, setValue } = form;
  const selectedStaffIds = watch("staffIds") || [];
  const [availableStaff, setAvailableStaff] = useState(initialStaff);
  const organizationId = watch("organizationId");
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
  const handleOrganizationChange = async (organizationId: string) => {
    setValue("organizationId", organizationId);

    // 営業チームメンバーを再取得
    try {
      const response = await fetch(
        `/api/organization/${organizationId}/sales-team`
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

  // スタッフの選択/解除を処理
  const handleStaffToggle = (staffId: string, checked: boolean) => {
    if (checked) {
      setValue("staffIds", [...selectedStaffIds, staffId]);
    } else {
      setValue(
        "staffIds",
        selectedStaffIds.filter((id) => id !== staffId)
      );
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
            />

            {/* 担当営業 */}
            <FormField
              control={control}
              name="staffIds"
              render={() => (
                <FormItem>
                  <FormLabel>担当営業</FormLabel>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {selectedStaffIds.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {availableStaff
                              .filter((staff) =>
                                selectedStaffIds.includes(staff.userId)
                              )
                              .map((staff) => (
                                <Badge
                                  key={staff.userId}
                                  variant="outline"
                                  className=""
                                >
                                  {staff.users.name || "名前なし"}
                                </Badge>
                              ))}
                          </div>
                        ) : (
                          "選択"
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
                            checked={selectedStaffIds.includes(staff.userId)}
                            onCheckedChange={(checked) =>
                              handleStaffToggle(staff.userId, checked)
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </SectionCard>
      )}

      {/* 物件情報 */}
      <SectionCard title="物件情報">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 w-full">
          <FormField
            control={control}
            name="propertyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>物件名</FormLabel>
                <FormControl>
                  <Input
                    id="propertyName"
                    placeholder="物件名を入力"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="roomNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>号室</FormLabel>
                <FormControl>
                  <Input
                    id="roomNumber"
                    placeholder="号室を入力"
                    autoComplete="off"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="ownerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>オーナー名</FormLabel>
                <FormControl>
                  <Input
                    id="ownerName"
                    placeholder="オーナー名を入力"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
          <FormField
            control={control}
            name="amountA"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>A金額（万円）</FormLabel>
                <FormControl>
                  <Input
                    id="amountA"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="金額を入力"
                    autoComplete="off"
                    disabled={isIyaku}
                    {...field}
                    value={value ?? ""}
                    onChange={(e) => {
                      const num = Number(e.target.value);
                      onChange(
                        e.target.value === "" ? null : num < 0 ? 0 : num
                      );
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="amountExit"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>出口金額（万円）</FormLabel>
                <FormControl>
                  <Input
                    id="amountExit"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="金額を入力"
                    autoComplete="off"
                    disabled={isIyaku}
                    {...field}
                    value={value ?? ""}
                    onChange={(e) => {
                      const num = Number(e.target.value);
                      onChange(
                        e.target.value === "" ? null : num < 0 ? 0 : num
                      );
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="commission"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>仲手等（万円）</FormLabel>
                <FormControl>
                  <Input
                    id="commission"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="金額を入力"
                    autoComplete="off"
                    disabled={isIyaku}
                    {...field}
                    value={value ?? ""}
                    onChange={(e) => {
                      const num = Number(e.target.value);
                      onChange(
                        e.target.value === "" ? null : num < 0 ? 0 : num
                      );
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 利益 - 違約の場合は手動入力、それ以外は自動計算 */}
          {isIyaku ? (
            <FormField
              control={control}
              name="profit"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>利益（万円）</FormLabel>
                  <FormControl>
                    <Input
                      id="profit"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="利益を入力"
                      autoComplete="off"
                      {...field}
                      value={value ?? ""}
                      onChange={(e) => {
                        const num = Number(e.target.value);
                        onChange(
                          e.target.value === "" ? null : num < 0 ? 0 : num
                        );
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormItem>
              <div className="flex flex-row justify-between gap-2">
                <FormLabel>利益（自動計算）</FormLabel>
                <p className="text-xs text-muted-foreground">
                  出口金額 - A金額 + 仲手等
                </p>
              </div>
              <FormControl>
                <Input
                  readOnly
                  className="bg-muted font-semibold text-green-600"
                  value={(() => {
                    const amountA = watch("amountA") || 0;
                    const amountExit = watch("amountExit") || 0;
                    const commission = watch("commission") || 0;
                    const profit = amountExit - amountA + commission;
                    return profit !== 0
                      ? `${profit.toLocaleString()}万円`
                      : "-";
                  })()}
                />
              </FormControl>
            </FormItem>
          )}

          <FormField
            control={control}
            name="bcDeposit"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>BC手付（万円）</FormLabel>
                <FormControl>
                  <Input
                    id="bcDeposit"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="金額を入力"
                    autoComplete="off"
                    disabled={isIyaku}
                    {...field}
                    value={value ?? ""}
                    onChange={(e) => {
                      const num = Number(e.target.value);
                      onChange(
                        e.target.value === "" ? null : num < 0 ? 0 : num
                      );
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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

          <FormField
            control={control}
            name="listType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>名簿種別</FormLabel>
                <FormControl>
                  <Input
                    id="listType"
                    placeholder="名簿種別を入力"
                    autoComplete="off"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </SectionCard>

      {/* 備考 */}
      <SectionCard title="備考">
        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea
                  id="notes"
                  placeholder="備考を入力"
                  rows={3}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </SectionCard>
    </div>
  );
}
