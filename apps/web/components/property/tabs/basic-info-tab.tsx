"use client";

import { useState } from "react";
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
import OrganizationSelectForm from "../form/organization-select-form";
import { Organization } from "@/lib/types/organization";
import { contractType } from "@workspace/drizzle/schemas";
import { CONTRACT_TYPE_COLORS, CONTRACT_TYPE_LABELS } from "@workspace/utils";
import { Badge } from "@workspace/ui/components/badge";
import SectionCard from "../section-card";

interface BasicInfoTabProps {
  availableStaff: { id: string; name: string; email: string; role: string }[];
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
                                selectedStaffIds.includes(staff.id)
                              )
                              .map((staff) => (
                                <Badge
                                  key={staff.id}
                                  variant="outline"
                                  className=""
                                >
                                  {staff.name || "名前なし"}
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
                            key={staff.id}
                            checked={selectedStaffIds.includes(staff.id)}
                            onCheckedChange={(checked) =>
                              handleStaffToggle(staff.id, checked)
                            }
                          >
                            <div className="flex flex-col">
                              <span>{staff.name || "名前なし"}</span>
                              {staff.email && (
                                <span className="text-xs text-muted-foreground">
                                  {staff.email}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 w-full">
          <FormField
            control={control}
            name="amountA"
            render={({ field }) => (
              <FormItem>
                <FormLabel>A金額（万円）</FormLabel>
                <FormControl>
                  <Input
                    id="amountA"
                    type="number"
                    placeholder="金額を入力"
                    autoComplete="off"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="amountExit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>出口金額（万円）</FormLabel>
                <FormControl>
                  <Input
                    id="amountExit"
                    type="number"
                    placeholder="金額を入力"
                    autoComplete="off"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="commission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>仲手等（万円）</FormLabel>
                <FormControl>
                  <Input
                    id="commission"
                    type="number"
                    placeholder="金額を入力"
                    autoComplete="off"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 利益（自動計算） */}
          <FormItem>
            <FormLabel>利益（自動計算）</FormLabel>
            <FormControl>
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
            </FormControl>
            <p className="text-xs text-muted-foreground">
              出口金額 - A金額 + 仲手等
            </p>
          </FormItem>

          <FormField
            control={control}
            name="bcDeposit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BC手付（万円）</FormLabel>
                <FormControl>
                  <Input
                    id="bcDeposit"
                    type="number"
                    placeholder="金額を入力"
                    autoComplete="off"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
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
          <FormField
            control={control}
            name="buyerCompany"
            render={({ field }) => (
              <FormItem>
                <FormLabel>買取業者</FormLabel>
                <FormControl>
                  <Input
                    id="buyerCompany"
                    placeholder="入力中に候補が表示されます"
                    autoComplete="off"
                    list="buyer-companies"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <datalist id="buyer-companies">
                  <option value="株式会社A不動産" />
                  <option value="株式会社B建設" />
                  <option value="C投資" />
                </datalist>
                <p className="text-xs text-muted-foreground">
                  検索方式 & 手入力可能
                </p>
                <FormMessage />
              </FormItem>
            )}
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

          <FormField
            control={control}
            name="mortgageBank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>抵当銀行</FormLabel>
                <FormControl>
                  <Input
                    id="mortgageBank"
                    placeholder="入力中に候補が表示されます"
                    autoComplete="off"
                    list="mortgage-banks"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <datalist id="mortgage-banks">
                  <option value="三菱UFJ銀行" />
                  <option value="三井住友銀行" />
                  <option value="みずほ銀行" />
                  <option value="りそな銀行" />
                </datalist>
                <p className="text-xs text-muted-foreground">
                  検索方式 & 手入力可能
                </p>
                <FormMessage />
              </FormItem>
            )}
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
