"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@workspace/auth/client";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
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
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";
import { OrganizationCreate } from "@/lib/types/auth";
import { organizationCreateSchema, slugSchema } from "@/lib/zod/schemas/auth";

export function CreateOrganizationForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  const form = useForm<OrganizationCreate>({
    resolver: zodResolver(organizationCreateSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const { errors, dirtyFields } = form.formState;
  const hasSlugError = !!errors.slug;
  const isSlugDirty = !!dirtyFields.slug;
  const isSlugValid = isSlugDirty && !hasSlugError && !isCheckingSlug;

  // slug重複チェック（デバウンス付き）
  const checkSlugAvailability = useDebouncedCallback(
    async (slug: string) => {
      if (!slug) {
        setIsCheckingSlug(false);
        return;
      }

      // 基本バリデーションをパスしているか確認
      const result = slugSchema.safeParse(slug);
      if (!result.success) {
        setIsCheckingSlug(false);
        return;
      }

      try {
        const { data } = await authClient.organization.checkSlug({
          slug,
        });

        if (!data?.status) {
          form.setError("slug", {
            type: "manual",
            message: "この識別IDは既に使用されています",
          });
        }
      } finally {
        setIsCheckingSlug(false);
      }
    },
    500,
    { leading: true }
  );

  const onSubmit = async (data: OrganizationCreate) => {
    startTransition(async () => {
      try {
        const { error } = await authClient.organization.create({
          ...data,
          keepCurrentActiveOrganization: false,
        });

        if (error) {
          toast.error(error.message || "組織の作成に失敗しました");
          return;
        }

        toast.success("組織を作成しました");

        // フォームをリセット
        form.reset();

        // 組織一覧ページへリダイレクト
        router.push("/organization");
        router.refresh();
      } catch (err) {
        console.error("Failed to create organization:", err);
        toast.error("予期しないエラーが発生しました");
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <CardTitle>新しい組織を作成</CardTitle>
        </div>
        <CardDescription>
          案件を管理する組織（会社）を作成しましょう
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 pb-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="text-sm flex flex-col gap-2 md:grid md:grid-cols-12">
                  <FormLabel className="whitespace-nowrap col-span-4">
                    組織名
                  </FormLabel>
                  <div className="col-span-8 space-y-1">
                    <FormControl>
                      <Input
                        placeholder="例: レイジット"
                        autoComplete="off"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="text-sm flex flex-col gap-2 md:grid md:grid-cols-12">
                  <FormLabel className="whitespace-nowrap col-span-4">
                    識別ID
                  </FormLabel>
                  <div className="col-span-8 space-y-1">
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="例: legit"
                          autoComplete="off"
                          disabled={isPending}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.toLowerCase();
                            field.onChange(value);
                            if (value) {
                              setIsCheckingSlug(true);
                            }
                            checkSlugAvailability(value);
                          }}
                        />
                        {field.value && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isCheckingSlug && (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            )}
                            {isSlugValid && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                            {hasSlugError && !isCheckingSlug && (
                              <XCircle className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    {hasSlugError ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>
                        {isCheckingSlug
                          ? "利用可能か確認中..."
                          : "半角英数字、アンダースコアのみ使用できます"}
                      </FormDescription>
                    )}
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              asChild
            >
              <Link href="/organization">キャンセル</Link>
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  作成中...
                </>
              ) : (
                "組織を作成"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
