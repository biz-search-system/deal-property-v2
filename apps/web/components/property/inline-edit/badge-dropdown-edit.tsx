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
import type { ActionResult } from "@/lib/types/action";

interface BadgeDropdownEditPropsBase<T extends string> {
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
  /** 編集可能かどうか */
  editable?: boolean;
  /** 成功時のメッセージ */
  successMessage?: string;
  /** エラー時のメッセージ */
  errorMessage?: string;
  /** ドロップダウンメニュー内の表示文字数 */
  maxLength?: number;
}

interface BadgeDropdownEditPropsAllowNull<T extends string>
  extends BadgeDropdownEditPropsBase<T> {
  /** nullを許可する */
  allowNull: true;
  /** 保存処理（nullを許可） */
  onSave: (id: string, newValue: T | null) => Promise<ActionResult>;
}

interface BadgeDropdownEditPropsNoNull<T extends string>
  extends BadgeDropdownEditPropsBase<T> {
  /** nullを許可しない */
  allowNull?: false;
  /** 保存処理（nullなし） */
  onSave: (id: string, newValue: T) => Promise<ActionResult>;
}

type BadgeDropdownEditProps<T extends string> =
  | BadgeDropdownEditPropsAllowNull<T>
  | BadgeDropdownEditPropsNoNull<T>;

export function BadgeDropdownEdit<T extends string>(
  props: BadgeDropdownEditProps<T>
) {
  const {
    id,
    currentValue,
    options,
    labels,
    colors,
    editable = true,
    successMessage = "更新しました",
    errorMessage = "更新に失敗しました",
    maxLength = 20,
    allowNull = false,
  } = props;

  const [isSaving, setIsSaving] = useState(false);

  const handleSelect = async (newValue: T | null) => {
    if (newValue === currentValue) return;

    setIsSaving(true);
    try {
      // allowNullに応じてonSaveの呼び出し方を分岐
      const result = props.allowNull
        ? await props.onSave(id, newValue)
        : await props.onSave(id, newValue as T);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(successMessage);
    } catch (error) {
      toast.error(errorMessage);
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
        "max-w-full w-full",
        "text-[9px] px-1 py-0",
        value && colors[value],
        isSaving && "opacity-50",
        editable && !isSaving && "hover:ring-1 hover:ring-ring"
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
