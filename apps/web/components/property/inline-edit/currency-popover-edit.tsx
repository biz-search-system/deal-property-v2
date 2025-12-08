"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { useState } from "react";
import { toast } from "sonner";

interface CurrencyPopoverEditProps {
  /** 対象のID */
  id: string;
  /** 現在の値（円単位） */
  currentValue: number | null;
  /** 保存処理（editable=trueの場合は必須） */
  onSave?: (id: string, newValue: number | null) => void | Promise<void>;
  /** 編集可能かどうか */
  editable?: boolean;
  /** ポップオーバーのタイトル */
  title: string;
  /** ポップオーバーの説明 */
  description?: string;
  /** 成功時のメッセージ */
  successMessage?: string;
  /** エラー時のメッセージ */
  errorMessage?: string;
  /** 表示フォーマット関数 */
  formatDisplay?: (value: number | null) => string;
  /** 強調表示するか（利益用） */
  highlight?: boolean;
  /** 入力のステップ（小数点以下の桁数制御） */
  step?: string;
}

const defaultFormatCurrency = (value: number | null): string => {
  if (value === null || value === undefined) return "-";
  if (value < 10000) {
    return `${value.toLocaleString()}円`;
  }
  const man = value / 10000;
  // 小数点以下がある場合は小数第二位まで表示（末尾の0は削除）
  if (man % 1 !== 0) {
    return `${parseFloat(man.toFixed(2))}万`;
  }
  return `${man.toFixed(0)}万`;
};

export function CurrencyPopoverEdit({
  id,
  currentValue,
  onSave,
  editable = true,
  title,
  description,
  successMessage = "更新しました",
  errorMessage = "更新に失敗しました",
  formatDisplay = defaultFormatCurrency,
  highlight = false,
  step = "0.1",
}: CurrencyPopoverEditProps) {
  const [open, setOpen] = useState(false);
  // 万円単位で入力・表示
  const [value, setValue] = useState(
    currentValue !== null ? String(currentValue / 10000) : ""
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      const numValue = value.trim() === "" ? null : Number(value) * 10000;
      if (value.trim() !== "" && isNaN(Number(value))) {
        toast.error("数値を入力してください");
        setIsSaving(false);
        return;
      }
      await onSave(id, numValue);
      toast.success(successMessage);
      setOpen(false);
    } catch (error) {
      toast.error(errorMessage);
      console.error(error);
      setValue(currentValue !== null ? String(currentValue / 10000) : "");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(currentValue !== null ? String(currentValue / 10000) : "");
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!editable) {
    return (
      <div
        className={`text-right text-[10px] ${highlight ? "font-semibold text-green-600 dark:text-green-400" : ""}`}
      >
        {formatDisplay(currentValue)}
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={`cursor-pointer rounded px-1 text-right text-[10px] hover:bg-muted ${highlight ? "font-semibold text-green-600 dark:text-green-400" : ""}`}
          title={
            currentValue !== null ? `${currentValue.toLocaleString()}円` : ""
          }
        >
          {formatDisplay(currentValue)}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{title}</h4>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step={step}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="0"
                className="text-right"
                autoFocus
              />
              <span className="shrink-0 text-sm text-muted-foreground">
                万円
              </span>
            </div>
            {value && !isNaN(Number(value)) && (
              <div className="text-right text-xs text-muted-foreground">
                {(Number(value) * 10000).toLocaleString()}円
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isSaving}
            >
              キャンセル
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "保存中..." : "保存"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
