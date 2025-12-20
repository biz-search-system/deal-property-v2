"use client";

import { useState, useTransition } from "react";
import { changePassword } from "@/lib/actions/user";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import FormSectionCard from "./form-section-card";
import InputForm from "./input-form";
import { PasswordChange } from "@/lib/types/auth";
import { passwordChangeSchema } from "@/lib/zod/schemas/auth";

export function PasswordChangeCard() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<PasswordChange>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = (formData: PasswordChange) => {
    startTransition(async () => {
      try {
        await changePassword(formData);
        toast.success("パスワードを変更しました");
        form.reset();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "パスワードの変更に失敗しました"
        );
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormSectionCard
          title="パスワード変更"
          description="パスワードを変更します"
          isPending={isPending}
        >
          <div className="flex flex-col gap-2 basis-7/12">
            <InputForm
              form={form}
              name="currentPassword"
              label="現在のパスワード"
              autoComplete="current-password"
              placeholder="********"
              description="現在のパスワードを入力してください"
            />
            <InputForm
              form={form}
              name="newPassword"
              label="新しいパスワード"
              autoComplete="new-password"
              placeholder="********"
              description="新しいパスワードを入力してください"
            />
          </div>
        </FormSectionCard>
      </form>
    </Form>
  );
}
