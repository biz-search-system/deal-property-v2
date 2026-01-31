import { BreadcrumbConfig } from "@/components/breadcrumb-provider";
import { ExitDetailView } from "@/components/exit/exit-detail-view";
import { getExitById } from "@/lib/mocks/exits";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "出口管理 詳細",
};

export default async function ExitDetailPage({
  params,
}: PageProps<"/exits/[exitId]">) {
  const { exitId } = await params;

  const exit = getExitById(exitId);

  if (!exit) {
    notFound();
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <BreadcrumbConfig
        items={[
          { label: "出口管理", href: "/exits" },
          { label: `${exit.propertyName}${exit.roomNumber ? ` ${exit.roomNumber}` : ""}` },
        ]}
      />
      <ExitDetailView exit={exit} />
    </div>
  );
}
