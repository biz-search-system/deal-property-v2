import { ExitNewForm } from "@/components/exit/exit-new-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "出口管理 新規登録",
};

export default function ExitNewPage() {
  return <ExitNewForm />;
}
