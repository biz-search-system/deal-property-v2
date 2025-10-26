"use client";

import PasswordForm from "@/components/auth/password-form";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Form } from "@workspace/ui/components/form";

import { ResetPassword } from "@/lib/types/auth";
import { resetPasswordSchema } from "@/lib/zod/schemas/auth";

import { updatePasswordAction } from "@/lib/actions/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@workspace/utils";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import HeroImage from "../hero-image";

export default function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const fromPath = searchParams.get("from");
  const otp = searchParams.get("otp");
  const email = searchParams.get("email");
  const router = useRouter();
  const form = useForm<ResetPassword>({
    mode: "onChange",
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: ResetPassword) => {
    if (!otp || !email) {
      toast.error("無効なリクエストです");
      return;
    }
    startTransition(async () => {
      await updatePasswordAction(data, otp, email)
        .then(() => {
          toast.success("パスワードを設定しました。");
          if (fromPath) {
            router.push(fromPath);
          } else {
            router.push("/properties/unconfirmed");
          }
        })
        .catch((error: Error) => {
          toast.error(error.message);
        });
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center lg:mb-3 mt-6">
                  <h1 className="text-xl font-bold">パスワードの更新</h1>
                  <p className="text-muted-foreground ">
                    新しいパスワードを設定してください
                  </p>
                </div>
                <PasswordForm
                  form={form}
                  name="password"
                  autoComplete="new-password"
                  mode="reset-password"
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      更新中...
                    </>
                  ) : (
                    "パスワードを更新"
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
