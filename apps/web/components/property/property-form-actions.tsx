"use client";

import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";

interface PropertyFormActionsProps {
  mode: "create" | "edit";
}

export default function PropertyFormActions({
  mode,
}: PropertyFormActionsProps) {
  const router = useRouter();

  const handleCancel = () => {
    router.push("/properties/unconfirmed");
  };

  return (
    <div className="flex justify-end gap-3">
      <Button type="button" variant="outline" onClick={handleCancel}>
        一覧に戻る
      </Button>
      <Button type="submit">{mode === "create" ? "登録" : "更新"}</Button>
    </div>
  );
}
