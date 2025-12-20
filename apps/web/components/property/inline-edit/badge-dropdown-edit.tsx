"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/utils";
import { truncateText } from "@/lib/property";
import { useState } from "react";
import { toast } from "sonner";

interface BadgeDropdownEditProps<T extends string> {
  /** 対象のID */
  id: string;
  /** 現在の値 */
  currentValue: T | null;
  /** 選択肢の配列 */
  options: readonly T[];
  /** 値からラベルへのマッピング */
  labels: Record<T, string>;
  /** 値から色クラスへのマッピング */
  colors: Record<T, string>;
  /** 保存処理 */
  onSave: (id: string, newValue: T | null) => void | Promise<void>;
  /** 編集可能かどうか */
  editable?: boolean;
  /** 成功時のメッセージ */
  successMessage?: string;
  /** エラー時のメッセージ */
  errorMessage?: string;
  /** ドロップダウンメニュー内の表示文字数 */
  maxLength?: number;
  /** nullを許可するか */
  allowNull?: boolean;
}

export function BadgeDropdownEdit<T extends string>({
  id,
  currentValue,
  options,
  labels,
  colors,
  onSave,
  editable = true,
  successMessage = "更新しました",
  errorMessage = "更新に失敗しました",
  maxLength = 20,
  allowNull = false,
}: BadgeDropdownEditProps<T>) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSelect = async (newValue: T | null) => {
    if (newValue === currentValue) return;

    setIsSaving(true);
    try {
      await onSave(id, newValue);
      toast.success(successMessage);
    } catch (error) {
      // サーバーからのエラーメッセージがあればそれを表示
      const message =
        error instanceof Error ? error.message : errorMessage;
      toast.error(message);
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const BadgeContent = ({
    value,
    showFullText = false,
  }: {
    value: T | null;
    showFullText?: boolean;
  }) => (
    <Badge
      variant="outline"
      className={cn(
        "text-[9px] px-1 py-0",
        value && colors[value],
        isSaving && "opacity-50",
        editable && !isSaving && "hover:ring-1 hover:ring-ring",
      )}
    >
      {showFullText
        ? (value && labels[value]) || "-"
        : truncateText((value && labels[value]) || null)}
    </Badge>
  );

  if (!editable) {
    return <BadgeContent value={currentValue} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isSaving}>
        <div className="cursor-pointer">
          <BadgeContent value={currentValue} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {allowNull && (
          <DropdownMenuCheckboxItem
            checked={currentValue === null}
            onCheckedChange={() => handleSelect(null)}
            className="cursor-pointer"
          >
            <Badge variant="outline" className="text-[9px] px-1 py-0">
              未設定
            </Badge>
          </DropdownMenuCheckboxItem>
        )}
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={option === currentValue}
            onCheckedChange={() => handleSelect(option)}
            className="cursor-pointer"
          >
            <Badge
              variant="outline"
              className={cn("text-[9px] px-1 py-0", colors[option])}
            >
              {truncateText(labels[option], maxLength)}
            </Badge>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
