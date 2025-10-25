"use client";

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
import {
  contractType,
  companyB,
  brokerCompany,
} from "@workspace/drizzle/types/property";
import { Checkbox } from "@workspace/ui/components/checkbox";

interface BasicInfoTabProps {
  availableStaff: { id: string; name: string | null }[];
}

export default function BasicInfoTab({ availableStaff }: BasicInfoTabProps) {
  const { control, watch, setValue } = usePropertyForm();
  const selectedStaffIds = watch("staffIds") || [];

  return (
    <div className="space-y-6">
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
          <FormField
            control={control}
            name="contractType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>契約形態</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="契約形態を選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contractType.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="companyB"
            render={({ field }) => (
              <FormItem>
                <FormLabel>B会社</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="B会社を選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {companyB.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="brokerCompany"
            render={({ field }) => (
              <FormItem>
                <FormLabel>仲介会社</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="仲介会社を選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brokerCompany.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
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

      {/* 担当者 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">担当者</h3>
        <FormField
          control={control}
          name="staffIds"
          render={() => (
            <FormItem>
              <div className="space-y-2">
                {availableStaff.map((staff) => (
                  <div key={staff.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`staff-${staff.id}`}
                      checked={selectedStaffIds.includes(staff.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setValue("staffIds", [...selectedStaffIds, staff.id]);
                        } else {
                          setValue(
                            "staffIds",
                            selectedStaffIds.filter((id) => id !== staff.id)
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={`staff-${staff.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {staff.name || "名前なし"}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
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
