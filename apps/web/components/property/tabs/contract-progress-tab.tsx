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
import { usePropertyForm } from "../property-form-provider";
import { progressStatus } from "@workspace/drizzle/constants";

export default function ContractProgressTab() {
  const { control } = usePropertyForm();

  return (
    <div className="space-y-6">
      {/* 進捗ステータス */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">進捗ステータス</h3>

        <FormField
          control={control}
          name="progressStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>進捗ステータス</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="進捗ステータスを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {progressStatus.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* 日付情報 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">日付情報</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="contractDateA"
            render={({ field }) => (
              <FormItem>
                <FormLabel>契約日A</FormLabel>
                <FormControl>
                  <Input
                    id="contractDateA"
                    type="date"
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
            name="contractDateBc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>契約日BC</FormLabel>
                <FormControl>
                  <Input
                    id="contractDateBc"
                    type="date"
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
            name="settlementDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>決済日</FormLabel>
                <FormControl>
                  <Input
                    id="settlementDate"
                    type="date"
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
    </div>
  );
}
