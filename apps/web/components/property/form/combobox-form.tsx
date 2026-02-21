"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Plus, Trash2, X } from "lucide-react";
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
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/utils";
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";

export interface ComboboxOption {
  id?: string;
  value: string;
  label: string;
}

interface ComboboxFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  options: ComboboxOption[];
  allowCustomValue?: boolean;
  onAddOption?: (value: string) => Promise<void>;
  onDeleteOption?: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export default function ComboboxForm<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
  label,
  placeholder = "選択してください",
  searchPlaceholder = "検索...",
  emptyMessage = "見つかりませんでした",
  description,
  disabled = false,
  required = false,
  className,
  options,
  allowCustomValue = true,
  onAddOption,
  onDeleteOption,
  isLoading = false,
}: ComboboxFormProps<TFieldValues, TName>) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        // 選択されている値のラベルを取得（カスタム値の場合は値そのまま）
        const selectedOption = options.find(
          (option) => option.value === field.value
        );
        const displayValue = selectedOption?.label || field.value || "";

        // フィルタリングされたオプション
        const filteredOptions = options.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        );

        // カスタム値として追加可能かチェック
        const showCustomOption =
          allowCustomValue &&
          inputValue.trim() !== "" &&
          !options.some(
            (option) =>
              option.label.toLowerCase() === inputValue.toLowerCase() ||
              option.value.toLowerCase() === inputValue.toLowerCase()
          );

        return (
          <Field
            data-invalid={fieldState.invalid}
            data-disabled={disabled}
            className={className}
          >
            {label && (
              <FieldLabel htmlFor={field.name} className="select-text">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FieldLabel>
            )}
            <div className="flex items-center gap-1">
              <div className="min-w-0 flex-1">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id={field.name}
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      aria-invalid={fieldState.invalid}
                      disabled={disabled}
                      className={cn(
                        "w-full justify-between font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {displayValue || placeholder}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
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
                      {filteredOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => {
                            field.onChange(option.value);
                            setInputValue("");
                            setOpen(false);
                          }}
                          className="group"
                        >
                          {option.label}
                          <div className="ml-auto flex items-center gap-1">
                            <Check
                              className={cn(
                                field.value === option.value
                                  ? "opacity-100"
                                  : "opacity-0"
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
                                    // 削除されたオプションが選択中だった場合、クリア
                                    if (field.value === option.value) {
                                      field.onChange("");
                                    }
                                  });
                                }}
                                disabled={deletingId === option.id}
                                className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity disabled:opacity-50"
                              >
                                <Trash2 className="size-4" />
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
                          onSelect={async () => {
                            setIsAdding(true);
                            try {
                              await onAddOption(inputValue);
                              field.onChange(inputValue);
                              setInputValue("");
                              setOpen(false);
                            } finally {
                              setIsAdding(false);
                            }
                          }}
                          disabled={isAdding}
                          className={cn(
                            "text-primary",
                            filteredOptions.length > 0 && "border-t"
                          )}
                        >
                          <Plus className="text-primary" />
                          「{inputValue}」を追加
                        </CommandItem>
                      )}
                      {showCustomOption && !onAddOption && (
                        <CommandItem
                          key={`custom-${inputValue}`}
                          value={`__custom__${inputValue}`}
                          onSelect={() => {
                            field.onChange(inputValue);
                            setInputValue("");
                            setOpen(false);
                          }}
                          className={
                            filteredOptions.length > 0 ? "border-t" : ""
                          }
                        >
                          「{inputValue}」を入力
                          <Check className="ml-auto opacity-0" />
                        </CommandItem>
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
                </PopoverContent>
                </Popover>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => field.onChange("")}
                disabled={disabled}
                className={cn((!field.value || required) && "invisible")}
                aria-label="選択を解除"
              >
                <X />
              </Button>
            </div>
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
