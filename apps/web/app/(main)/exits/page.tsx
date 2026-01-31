import { BreadcrumbConfig } from "@/components/breadcrumb-provider";
import { ExitList } from "@/components/exit/exit-list";
import { getAllExits, getExitsTotals } from "@/lib/mocks/exits";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "出口管理",
};

export default async function ExitsPage() {
  // モックデータを使用（後でDBに置き換え）
  const exits = getAllExits();
  const totals = getExitsTotals();

  return (
    <>
      <BreadcrumbConfig items={[{ label: "出口管理" }]} />
      <ExitList exits={exits} totals={totals} />
    </>
  );
}
