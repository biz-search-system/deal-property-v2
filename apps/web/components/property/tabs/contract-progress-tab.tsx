"use client";

import {
  PROGRESS_STATUS_COLORS,
  PROGRESS_STATUS_LABELS,
} from "@workspace/utils";
import { progressStatus } from "@workspace/drizzle/schemas/property";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import BadgeSelectForm from "../form/badge-select-form";
import { usePropertyForm } from "../property-form-provider";

export default function ContractProgressTab() {
  const form = usePropertyForm();
  const { control } = form;

  return (
    <div className="space-y-6">
      {/* 進捗ステータス */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">進捗ステータス</h3>
        <BadgeSelectForm
          form={form}
          name="progressStatus"
          label="進捗ステータス"
          options={progressStatus.map((type) => ({
            value: type,
            label: PROGRESS_STATUS_LABELS[type],
            color: PROGRESS_STATUS_COLORS[type],
          }))}
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
