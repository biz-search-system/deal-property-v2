import { BreadcrumbConfig } from "@/components/breadcrumb-provider";
import { MaisokuEditor } from "@/components/exit/maisoku/maisoku-editor";
import { getExitById } from "@/lib/mocks/exits";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "マイソク作成",
};

export default async function MaisokuPage({
  params,
}: PageProps<"/exits/[exitId]/maisoku">) {
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
          {
            label: `${exit.propertyName}${exit.roomNumber ? ` ${exit.roomNumber}` : ""}`,
            href: `/exits/${exitId}`,
          },
          { label: "マイソク作成" },
        ]}
      />
      <MaisokuEditor exit={exit} />
    </div>
  );
}
