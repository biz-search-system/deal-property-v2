"use client";

import {
  ImageCropper,
  ImageCropperFileSelector,
  ImageCropperPreview,
} from "@/components/image-cropper";
import { updateProfileAction } from "@/lib/actions/user";
import { User } from "@/lib/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileUpdate } from "@workspace/drizzle/types";
import { profileUpdateSchema } from "@workspace/drizzle/zod-schemas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { formatToJapaneseDateTime } from "@workspace/utils";
import { Trash2Icon, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import FormSectionCard from "./form-section-card";
import InputForm from "./input-form";
import { getAvatarUrl } from "@/lib/avatar";
import { clearAllCache } from "@/lib/swr/mutate";

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const avatarUrl = getAvatarUrl({
    username: user.username,
    email: user.email,
  });

  const form = useForm<ProfileUpdate>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user.name,
      username: user.username || "",
      image: user.image || avatarUrl.url,
    },
  });
  const onSubmit = (formData: ProfileUpdate) => {
    startTransition(async () => {
      try {
        await updateProfileAction(formData);

        // await clearAllCache()
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

          <div className="flex justify-center gap-4 basis-5/12 order-first md:order-last ">
            {/* <Avatar className="size-36">
              <AvatarFallback className="bg-primary/10">
                <UserIcon className="size-10 text-primary" />
              </AvatarFallback>
            </Avatar> */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 items-center">
                  <FormLabel>プロフィール画像</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <ImageCropperFileSelector
                        onFileSelect={(file) => {
                          setFile(file);
                          setOpen(true);
                        }}
                        className="w-full aspect-square rounded-full size-36"
                      >
                        {field.value && (
                          <ImageCropperPreview
                            src={field.value}
                            showRemoveButton={false}
                          />
                        )}
                      </ImageCropperFileSelector>
                      {field.value && field.value !== avatarUrl.url && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="absolute bottom-2 left-2 size-8 text-muted-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            field.onChange(avatarUrl.url);
                          }}
                        >
                          <Trash2Icon size={16} />
                          <span className="sr-only">画像を削除</span>
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSectionCard>
      </form>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle className="sr-only">プロフィール画像</DialogTitle>
        </DialogHeader>
        <DialogContent className="max-w-md">
          {file && (
            <ImageCropper
              image={file}
              canvasWidth={200}
              aspectRatio={1}
              resultWidth={200}
              circular={true}
              onCrop={(dataUrl, blob) => {
                form.setValue("image", dataUrl);
                setOpen(false);
              }}
              onCancel={() => setOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Form>
  );
}
