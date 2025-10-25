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
import { documentStatus } from "@workspace/drizzle/types/property";

export default function DocumentProgressTab() {
  const { control } = usePropertyForm();

  return (
    <div className="space-y-6">
      {/* 書類ステータス */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">書類ステータス</h3>

        <FormField
          control={control}
          name="documentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>書類ステータス</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="書類ステータスを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {documentStatus.map((status) => (
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

      <div className="text-sm text-muted-foreground">
        書類の詳細ステータスは別途、書類進捗テーブルで管理されます。
      </div>
    </div>
  );
}
