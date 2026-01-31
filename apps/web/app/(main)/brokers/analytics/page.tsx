import { BreadcrumbConfig } from "@/components/breadcrumb-provider";
import { BrokerAnalyticsSummary } from "@/components/exit/broker/broker-analytics-summary";
import { BrokerAnalyticsTable } from "@/components/exit/broker/broker-analytics-table";
import { mockBrokerAnalytics } from "@/lib/mocks/brokers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "業者分析",
};

export default function BrokerAnalyticsPage() {
  // TODO: 実際のデータ取得に置き換え
  const analytics = mockBrokerAnalytics;

  return (
    <>
      <BreadcrumbConfig
        items={[
          { label: "業者マスタ", href: "/brokers" },
          { label: "業者分析" },
        ]}
      />
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex flex-1 flex-col gap-3 overflow-hidden p-3 lg:p-3">
          {/* 集計サマリー */}
          <BrokerAnalyticsSummary analytics={analytics} />

          {/* 分析テーブル */}
          <BrokerAnalyticsTable analytics={analytics} />
        </div>
      </div>
    </>
  );
}
