"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Form } from "@workspace/ui/components/form";
import { Label } from "@workspace/ui/components/label";
import { useForm } from "react-hook-form";

import { updateProfileAction } from "@/lib/actions/user";
import { User } from "@/lib/types/auth";
import { ProfileUpdate } from "@workspace/drizzle/types";
import { profileUpdateSchema } from "@workspace/drizzle/zod-schemas";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { formatToJapaneseDateTime } from "@workspace/utils";
import { UserIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import InputForm from "./input-form";
import FormSectionCard from "./form-section-card";

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ProfileUpdate>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user.name,
      username: user.username || "",
    },
  });
  const onSubmit = (formData: ProfileUpdate) => {
    startTransition(async () => {
      try {
        await updateProfileAction(formData);
        mutate("/api/session");
        toast.success("プロフィールを更新しました");
      } catch (error) {
        toast.error("更新に失敗しました");
        console.error(error);
      }
    });
  };
  const createdAt = formatToJapaneseDateTime(user.createdAt);
  const updatedAt = formatToJapaneseDateTime(user.updatedAt);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormSectionCard
          title="プロフィール"
          description="プロフィールを更新します"
          isPending={isPending}
        >
          <div className="flex flex-col gap-6 basis-7/12">
            <InputForm
              form={form}
              name="name"
              label="名前"
              autoComplete="name"
              placeholder="山田"
              description="苗字のみを入力してください"
            />
            <InputForm
              form={form}
              name="username"
              label="ユーザーID"
              autoComplete="username"
              placeholder="yamada_taro"
              description="一意のユーザー名を設定できます"
            />
            <div className="flex flex-row">
              <div className="flex basis-5/12">
                <Label>メールアドレス</Label>
              </div>
              <div className="flex basis-7/12">
                <span className="text-sm">{user.email}</span>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="flex basis-5/12">
                <Label>登録日</Label>
              </div>
              <div className="flex basis-7/12">
                <span className="text-sm">{createdAt}</span>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="flex basis-5/12">
                <Label>更新日</Label>
              </div>
              <div className="flex basis-7/12">
                <span className="text-sm">{updatedAt}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 basis-5/12 order-first md:order-last">
            <Avatar className="size-36">
              <AvatarFallback className="bg-primary/10">
                <UserIcon className="size-10 text-primary" />
              </AvatarFallback>
            </Avatar>
          </div>
        </FormSectionCard>
      </form>
    </Form>
  );
}
