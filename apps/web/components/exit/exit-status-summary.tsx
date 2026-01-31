"use client";

import type { ExitStatus } from "@/lib/types/exit";
import { EXIT_STATUS_LABELS } from "@/lib/types/exit";
import {
  SummaryCardGrid,
  type SummaryItem,
} from "@/components/ui/summary-card";

interface StatusCount {
  status: ExitStatus;
  count: number;
}

interface ExitStatusSummaryProps {
  totalCount: number;
  statusCounts: StatusCount[];
}

export function ExitStatusSummary({
  totalCount,
  statusCounts,
}: ExitStatusSummaryProps) {
  const items: SummaryItem[] = [
    { label: "全件", value: totalCount },
    ...statusCounts.map(({ status, count }) => ({
      label: EXIT_STATUS_LABELS[status],
      value: count,
    })),
  ];

  return <SummaryCardGrid items={items} columns={5} />;
}
