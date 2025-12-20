"use client";

import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface ComboboxOption {
  id?: string;
  value: string;
  label: string;
}

interface ComboboxPopoverEditProps {
  /** 対象のID */
  id: string;
  /** 現在の値 */
  currentValue: string | null;
  /** 選択肢 */
  options: ComboboxOption[];
  /** 保存処理 */
  onSave: (id: string, newValue: string | null) => void | Promise<void>;
  /** 編集可能かどうか */
  editable?: boolean;
  /** 成功時のメッセージ */
  successMessage?: string;
  /** エラー時のメッセージ */
  errorMessage?: string;
  /** 検索プレースホルダー */
  searchPlaceholder?: string;
  /** 空のメッセージ */
  emptyMessage?: string;
  /** オプション追加時のコールバック */
  onAddOption?: (value: string) => Promise<void>;
  /** オプション削除時のコールバック */
  onDeleteOption?: (id: string) => Promise<void>;
  /** nullを許可するか */
  allowNull?: boolean;
  /** ローディング中か */
  isLoading?: boolean;
}

export function ComboboxPopoverEdit({
  id,
  currentValue,
  options,
  onSave,
  editable = true,
  successMessage = "更新しました",
  errorMessage = "更新に失敗しました",
  searchPlaceholder = "検索...",
  emptyMessage = "見つかりませんでした",
  onAddOption,
  onDeleteOption,
  allowNull = true,
  isLoading = false,
}: ComboboxPopoverEditProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  // 選択されている値のラベルを取得
  const selectedOption = options.find((option) => option.value === currentValue);
  const displayValue = selectedOption?.label || currentValue || "-";

  // フィルタリングされたオプション
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  // カスタム値として追加可能かチェック
  const showCustomOption =
    inputValue.trim() !== "" &&
    !options.some(
      (option) =>
        option.label.toLowerCase() === inputValue.toLowerCase() ||
        option.value.toLowerCase() === inputValue.toLowerCase()
    );

  const handleSelect = async (value: string | null) => {
    if (value === currentValue) {
      setOpen(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(id, value);
      toast.success(successMessage);
      setOpen(false);
      setInputValue("");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : errorMessage;
      toast.error(message);
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAndSelect = async () => {
    if (!onAddOption) return;

    setIsAdding(true);
    try {
      await onAddOption(inputValue);
      await handleSelect(inputValue);
    } catch (error) {
      toast.error("追加に失敗しました");
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  if (!editable) {
    return (
      <div className="max-w-full w-full text-[10px] truncate">
        {displayValue}
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          disabled={isSaving || isLoading}
          className={cn(
            "h-auto max-w-full w-full p-1 justify-start text-[10px] font-normal transition-[color,box-shadow] hover:bg-transparent hover:ring-ring/50 hover:ring-[3px]",
            !currentValue && "text-muted-foreground"
          )}
        >
          <p className="truncate text-left">{displayValue}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9"
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            {filteredOptions.length === 0 && !showCustomOption && (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            )}
            <CommandGroup>
              {allowNull && (
                <CommandItem
                  value="__null__"
                  onSelect={() => handleSelect(null)}
                  disabled={isSaving}
                  className="text-muted-foreground"
                >
                  未設定
                  <Check
                    className={cn(
                      "ml-auto",
                      currentValue === null ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )}
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  disabled={isSaving}
                  className="group"
                >
                  {option.label}
                  <div className="ml-auto flex items-center gap-1">
                    <Check
                      className={cn(
                        currentValue === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {onDeleteOption && option.id && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingId(option.id!);
                          onDeleteOption(option.id!).finally(() => {
                            setDeletingId(null);
                          });
                        }}
                        disabled={deletingId === option.id}
                        className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity disabled:opacity-50"
                      >
                        <Trash2 className="size-3" />
                        <span className="sr-only">削除</span>
                      </button>
                    )}
                  </div>
                </CommandItem>
              ))}
              {showCustomOption && onAddOption && (
                <CommandItem
                  key={`add-${inputValue}`}
                  value={`__add__${inputValue}`}
                  onSelect={handleAddAndSelect}
                  disabled={isAdding || isSaving}
                  className={cn(
                    "text-primary",
                    filteredOptions.length > 0 && "border-t"
                  )}
                >
                  <Plus className="text-primary size-3" />
                  「{inputValue}」を追加
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
