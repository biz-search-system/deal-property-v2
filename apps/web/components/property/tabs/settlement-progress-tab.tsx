"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { usePropertyForm } from "../property-form-provider";
import {
  accountCompany,
  bankAccount,
} from "@workspace/drizzle/types/property";

export default function SettlementProgressTab() {
  const { control } = usePropertyForm();

  return (
    <div className="space-y-6">
      {/* 口座情報 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">口座情報</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="accountCompany"
            render={({ field }) => (
              <FormItem>
                <FormLabel>使用口座会社</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="使用口座会社を選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accountCompany.map((company) => (
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
            name="bankAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>使用銀行口座</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="使用銀行口座を選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bankAccount.map((account) => (
                      <SelectItem key={account} value={account}>
                        {account}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        決済の詳細ステータスは別途、決済進捗テーブルで管理されます。
      </div>
    </div>
  );
}
