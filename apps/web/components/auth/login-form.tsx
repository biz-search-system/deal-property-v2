"use client";

import HeroImage from "@/components/hero-image";
import { loginAction } from "@/lib/actions/auth";
import { refreshAuthenticatedData } from "@/lib/swr/mutate";
import type { Login } from "@/lib/types/auth";
import { loginSchema } from "@/lib/zod/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@workspace/auth/client";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/utils";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import PasswordForm from "./password-form";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const invitationId = searchParams.get("invitationId");

  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: Login) => {
    startTransition(async () => {
      // ログイン
      const result = await loginAction(data);

      if (result.error) {
        toast.error(result.error);
        return;
      }
      // 認証関連データを一括更新
      await refreshAuthenticatedData();

      // 招待がある場合は受け入れる
      if (invitationId) {
        const { error: acceptError } =
          await authClient.organization.acceptInvitation({
            invitationId,
          });

        if (acceptError) {
          console.error(acceptError);
          toast.error(acceptError.message || "招待の受け入れに失敗しました");
          return;
        }
      }

      toast.success(
        invitationId ? "招待の受け入れに成功しました" : "ログインしました"
      );
      router.push("/properties/unconfirmed");
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-xl font-bold">ようこそ</h1>
                  <p className="text-muted-foreground text-balance">
                    あなたのアカウントにログインしてください
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="example@example.com"
                          autoComplete="email"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <PasswordForm
                  form={form}
                  name="password"
                  autoComplete="current-password"
                  mode="login"
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" />
                      ログイン中...
                    </>
                  ) : (
                    "ログイン"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <div className="bg-muted relative hidden md:flex items-center justify-center">
            <HeroImage />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
