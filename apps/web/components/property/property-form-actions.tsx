import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

interface PropertyFormActionsProps {
  mode: "create" | "edit";
}

export default function PropertyFormActions({
  mode,
}: PropertyFormActionsProps) {
  return (
    <div className="flex justify-end gap-3">
      <Button type="button" variant="outline" asChild>
        <Link href="/properties/unconfirmed">一覧に戻る</Link>
      </Button>
      <Button type="submit">{mode === "create" ? "登録" : "更新"}</Button>
    </div>
  );
}
