import { BreadcrumbConfig } from "@/components/breadcrumb-provider";
import { BrokerTable } from "@/components/exit/broker/broker-table";
import { SummaryCardGrid } from "@/components/ui/summary-card";
import { mockBrokers } from "@/lib/mocks/brokers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "業者マスタ",
};

export default function BrokersPage() {
  // TODO: 実際のデータ取得に置き換え
  const brokers = mockBrokers;

  // 集計
  const totals = {
    total: brokers.length,
    active: brokers.filter((b) => b.isActive).length,
    buyer: brokers.filter((b) => b.brokerType === "buyer").length,
    broker: brokers.filter((b) => b.brokerType === "broker").length,
  };

  const summaryItems = [
    { label: "合計", value: totals.total, unit: "社" },
    {
      label: "有効",
      value: totals.active,
      unit: "社",
      className: "text-green-600",
    },
    { label: "買取業者", value: totals.buyer, unit: "社" },
    { label: "買取仲介", value: totals.broker, unit: "社" },
  ];

  return (
    <>
      <BreadcrumbConfig items={[{ label: "業者マスタ" }]} />
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex flex-1 flex-col gap-3 overflow-hidden p-3 lg:p-3">
          {/* 集計表示 */}
          <SummaryCardGrid items={summaryItems} columns={4} />

          {/* テーブル */}
          <BrokerTable brokers={brokers} />
        </div>
      </div>
    </>
  );
}
