"use client";

import { forgotPasswordSchema } from "@/lib/zod/schemas/auth";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";

import { forgotPasswordAction } from "@/lib/actions/auth";
import { ForgotPassword } from "@/lib/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@workspace/utils";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import HeroImage from "../hero-image";

export default function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const form = useForm<ForgotPassword>({
    mode: "onChange",
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (data: ForgotPassword) => {
    startTransition(async () => {
      try {
        await forgotPasswordAction(data);
        setIsEmailSent(true);
        toast.success("パスワードリセットメールを送信しました");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "メール送信に失敗しました。もう一度お試しください。"
        );
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {isEmailSent ? (
            <div className="flex flex-col gap-6 p-6 md:p-8 justify-center">
              <CardHeader className="space-y-1 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center">
                  <CheckCircle className="size-12 text-green-500" />
                </div>
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  メール送信完了
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  パスワードリセットメールを送信しました
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4"></CardContent>
              <CardFooter>
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    ログインページに戻る
                  </Button>
                </Link>
              </CardFooter>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="p-6 md:p-8"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center lg:mb-3 mt-6">
                    <h1 className="text-xl font-bold"> パスワードリセット</h1>
                    <p className="text-muted-foreground ">
                      メールアドレスを入力してください。
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
                            type="email"
                            placeholder="example@email.com"
                            autoComplete="email"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!isValid || isSubmitting || isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        送信中...
                      </>
                    ) : (
                      "リセットメールを送信"
                    )}
                  </Button>
                  <Link href="/login" className="w-full">
                    <Button variant="ghost" className="w-full" type="button">
                      ログインページに戻る
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          )}
          <div className="bg-muted relative hidden md:flex items-center justify-center">
            <HeroImage />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
