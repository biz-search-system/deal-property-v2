"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { cn } from "@workspace/utils";
import HeroImage from "@/components/hero-image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@workspace/auth/client";
// import { Signup } from "@workspace/drizzle/types";

import PasswordForm from "./password-form";
import { useDebouncedCallback } from "use-debounce";
import { signupSchema, usernameSchema } from "@/lib/zod/schemas/auth";
import { Signup } from "@/lib/types/auth";

interface SignupFormProps {
  className?: string;
  invitationId: string;
  initialEmail: string;
  organizationName: string;
}

export function SignupForm({
  invitationId,
  initialEmail,
  organizationName,
  className,
}: SignupFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // React Hook Formの設定
  const form = useForm<Signup>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      email: initialEmail,
      name: "",
      username: "",
      password: "",
      invitationId: invitationId,
    },
  });

  // 招待経由の場合、メールアドレスを読み取り専用
  const isInvitation = !!invitationId;

  // ユーザー名の状態判定
  const { errors, dirtyFields } = form.formState;
  const hasUsernameError = !!errors.username;
  const isUsernameDirty = !!dirtyFields.username;
  const isUsernameValid =
    isUsernameDirty && !hasUsernameError && !isCheckingUsername;

  // ユーザー名の重複チェック（デバウンス付き）
  const checkUsernameAvailability = useDebouncedCallback(
    async (username: string) => {
      // 空の場合は確認中を解除
      if (!username) {
        setIsCheckingUsername(false);
        return;
      }

      // 基本的なバリデーションをパスしているか確認
      const result = usernameSchema.safeParse(username);
      if (!result.success) {
        setIsCheckingUsername(false);
        return;
      }
      try {
        const { data: response, error } = await authClient.isUsernameAvailable({
          username,
        });

        if (error) {
          toast.error(error.message || "ユーザー名の確認に失敗しました");
          return;
        }

        if (!response.available) {
          form.setError("username", {
            type: "manual",
            message: "このユーザー名は既に使用されています",
          });
        }
      } finally {
        setIsCheckingUsername(false);
      }
    },
    500,
    { leading: true }
  );

  const onSubmit = (data: Signup) => {
    startTransition(async () => {
      const { email, name, password, username, invitationId } = data;

      // 1. アカウント作成
      const { data: signupResult, error: signupError } =
        await authClient.signUp.email({
          email,
          name,
          password,
          username,
        });

      if (signupError) {
        if (
          signupError.code === "USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER"
        ) {
          toast.error(
            "このメールアドレスはすでに使用されています.ログインして招待を受け入れてください."
          );
          router.push(`/login?invitationId=${invitationId}`);
          return;
        }
        toast.error(signupError.message || "登録に失敗しました");
        return;
      }

      if (signupResult) {
        // 招待IDがある場合は招待を受け入れる
        if (invitationId) {
          const { data: acceptResult, error: acceptError } =
            await authClient.organization.acceptInvitation({
              invitationId,
            });
          if (acceptError) {
            console.error(acceptError);
            toast.error(acceptError.message || "招待の受け入れに失敗しました");
            return;
          }
          if (acceptResult) {
            toast.success("アカウントの登録と組織への参加が完了しました！");
            router.push("/properties/unconfirmed");
            return;
          }
        }
        // 通常のサインアップ成功時
        toast.success("アカウントの登録が完了しました！");
        router.push("/properties/unconfirmed");
      }
    });
  };
  // const { isDirty, isValid } = form.formState;
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-xl font-bold">
                    {" "}
                    組織：{organizationName}
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    アカウントを作成してください。
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, formState: { errors } }) => (
                    <FormItem>
                      <FormLabel>お名前</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="山田 太郎"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      {errors.name?.message ? (
                        <FormMessage>{errors.name.message}</FormMessage>
                      ) : (
                        <FormDescription>
                          苗字のみを入力してください（例：山田）
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ユーザーID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="yamada_taro"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (e.target.value) {
                                setIsCheckingUsername(true);
                              }
                              checkUsernameAvailability(e.target.value);
                            }}
                            disabled={isPending}
                          />
                          {field.value && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              {isCheckingUsername && (
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              )}
                              {isUsernameValid && (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              )}
                              {hasUsernameError && !isCheckingUsername && (
                                <XCircle className="h-4 w-4 text-destructive" />
                              )}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      {hasUsernameError ? (
                        <FormMessage />
                      ) : (
                        <FormDescription>
                          {isCheckingUsername
                            ? "利用可能か確認中..."
                            : "英数字、アンダースコアのみ（3-20文字）"}
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@example.com"
                          {...field}
                          disabled={isPending || isInvitation}
                          readOnly={isInvitation}
                        />
                      </FormControl>
                      {isInvitation && (
                        <FormDescription>
                          * 招待されたメールアドレスは変更できません
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <PasswordForm
                  form={form}
                  name="password"
                  mode="signup"
                  autoComplete="new-password"
                  placeholder="6文字以上の英数字で入力してください"
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      登録中...
                    </>
                  ) : (
                    "アカウントを作成"
                  )}
                </Button>

                <div className="text-center text-sm">
                  既にアカウントをお持ちの方は{" "}
                  <Link
                    href={
                      isInvitation
                        ? `/login?invitationId=${invitationId}`
                        : "/login"
                    }
                    className="underline underline-offset-4"
                  >
                    ログイン
                  </Link>
                </div>
              </form>
            </Form>
          </div>

          <div className="bg-muted relative hidden md:flex items-center justify-center">
            <HeroImage />
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        続行することで、<a href="#">利用規約</a> および
        <a href="#">プライバシーポリシー</a>に同意したものとみなされます。
      </div>
    </div>
  );
}
