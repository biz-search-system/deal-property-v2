"use client";

import { Button } from "@workspace/ui/components/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

export default function PasswordForm<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
  autoComplete,
  placeholder = "********",
  mode = "login",
}: {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  autoComplete: "new-password" | "current-password";
  placeholder?: string;
  mode?: "login" | "forgot-password" | "reset-password" | "signup";
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    formState: { errors },
  } = form;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>パスワード</FormLabel>
            {mode === "login" && (
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground font-semibold"
              >
                パスワードを忘れた
              </Link>
            )}
          </div>
          <FormControl>
            <div className="relative">
              <Input
                type={passwordVisible ? "text" : "password"}
                autoComplete={autoComplete}
                placeholder={placeholder}
                minLength={8}
                className="pr-10"
                {...field}
              />
              <Button
                size="icon"
                type="button"
                className="absolute top-0 right-0"
                variant="ghost"
                onClick={() => setPasswordVisible((v) => !v)}
              >
                {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                <span className="sr-only">
                  {passwordVisible ? "パスワードを隠す" : "パスワードを表示"}
                </span>
              </Button>
            </div>
          </FormControl>
          {errors[name] ? (
            <FormMessage />
          ) : (
            <FormDescription>
              {autoComplete === "new-password"
                ? "英字と数字を含む6文字以上で設定してください"
                : ""}
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}
