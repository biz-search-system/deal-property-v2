import { BreadcrumbConfig } from "@/components/breadcrumb-provider";
import { ExitNewForm } from "@/components/exit/exit-new-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "出口管理 新規登録",
};

export default function ExitNewPage() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <BreadcrumbConfig
        items={[
          { label: "出口管理", href: "/exits" },
          { label: "新規登録" },
        ]}
      />
      <ExitNewForm />
    </div>
  );
}
