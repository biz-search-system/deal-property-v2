"use client";

import { SummaryCardGrid, type SummaryItem } from "@/components/ui/summary-card";
import type { BrokerAnalytics } from "@/lib/types/broker";

interface BrokerAnalyticsSummaryProps {
  analytics: BrokerAnalytics[];
}

export function BrokerAnalyticsSummary({
  analytics,
}: BrokerAnalyticsSummaryProps) {
  // 全体集計
  const totalDistributions = analytics.reduce(
    (sum, a) => sum + a.distributionCount,
    0
  );
  const totalResponses = analytics.reduce(
    (sum, a) => sum + a.responseCount,
    0
  );
  const totalContracts = analytics.reduce(
    (sum, a) => sum + a.contractCount,
    0
  );
  const overallResponseRate =
    totalDistributions > 0
      ? ((totalResponses / totalDistributions) * 100).toFixed(1)
      : "0";
  const overallContractRate =
    totalResponses > 0
      ? ((totalContracts / totalResponses) * 100).toFixed(1)
      : "0";

  const items: SummaryItem[] = [
    { label: "総配布数", value: totalDistributions },
    { label: "総回答数", value: totalResponses },
    {
      label: "平均回答率",
      value: overallResponseRate,
      unit: "%",
      className: "text-green-600",
    },
    { label: "総成約数", value: totalContracts },
    {
      label: "平均成約率",
      value: overallContractRate,
      unit: "%",
      className: "text-blue-600",
    },
  ];

  return <SummaryCardGrid items={items} columns={5} />;
}
