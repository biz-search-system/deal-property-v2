"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

interface ProfileCardProps {}

export function ProfileCard({}: ProfileCardProps) {
  // 保存処理
  const handleSave = async () => {};

  return (
    <Card className="p-0 overflow-hidden">
      <CardHeader className="m-0 border-b [.border-b]:py-5 bg-muted/30 flex items-center">
        <CardTitle className="">プロフィール</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative text-sm flex flex-col gap-2 md:grid md:grid-cols-12 md:items-center">
          <div className="flex items-center md:col-span-3">
            <Label htmlFor="email" className="text-nowrap">
              ユーザー名
            </Label>
          </div>
          <div className="flex items-center col-span-8 gap-4">
            <Input
              id="email"
              placeholder="山田"
              autoComplete="family-name"
              className="text-sm leading-4 px-3 py-2 max-w-72"
            />
            <CardDescription>苗字のみを入力してください</CardDescription>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t [.border-t]:py-3 flex justify-between">
        <CardDescription>
          決済に使用する銀行口座を選択してください
        </CardDescription>
        <Button onClick={handleSave} disabled>
          "保存"
        </Button>
      </CardFooter>
    </Card>
  );
}
