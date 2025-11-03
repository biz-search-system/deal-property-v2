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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
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
import {
  CONTRACT_TYPE_COLORS,
  CONTRACT_TYPE_LABELS,
  contractType,
} from "@workspace/drizzle/constants";

interface BasicInfoTabProps {
  availableStaff: { id: string; name: string; email: string; role: string }[];
  organizations?: Array<{
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    logo?: string | null;
    metadata?: any;
  }>;
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
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">組織情報</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 管理組織 */}
            <FormField
              control={control}
              name="organizationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>管理組織</FormLabel>
                  <Select
                    onValueChange={handleOrganizationChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="組織を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
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
                        {selectedStaffIds.length > 0
                          ? `${selectedStaffIds.length}名選択中`
                          : "選択"}
                        <ChevronDown className="ml-2 h-4 w-4" />
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
                  {selectedStaffIds.length > 0 && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {availableStaff
                        .filter((staff) => selectedStaffIds.includes(staff.id))
                        .map((staff) => staff.name || "名前なし")
                        .join(", ")}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}

      {/* 物件情報 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">物件情報</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

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
                  autoComplete="name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* 金額情報 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">金額情報</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="amountA"
            render={({ field }) => (
              <FormItem>
                <FormLabel>A金額</FormLabel>
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
                <FormLabel>出口金額</FormLabel>
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
                <FormLabel>仲手等</FormLabel>
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

          <FormField
            control={control}
            name="bcDeposit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BC手付</FormLabel>
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
      </div>

      {/* 契約情報 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">契約情報</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            name="buyerCompany"
            render={({ field }) => (
              <FormItem>
                <FormLabel>買取業者</FormLabel>
                <FormControl>
                  <Input
                    id="buyerCompany"
                    placeholder="買取業者を入力"
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
            name="mortgageBank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>抵当銀行</FormLabel>
                <FormControl>
                  <Input
                    id="mortgageBank"
                    placeholder="抵当銀行を入力"
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
      </div>

      {/* 備考 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">備考</h3>
        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>備考</FormLabel>
              <FormControl>
                <Textarea
                  id="notes"
                  placeholder="備考を入力"
                  rows={4}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
