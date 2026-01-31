import type { ExitListItem } from "@/lib/types/exit";
import { ExitListTable } from "./exit-list-table";
import { ExitStatusSummary } from "./exit-status-summary";

interface ExitListProps {
  exits: ExitListItem[];
  totals: {
    count: number;
    confirmedCount: number;
    negotiatingCount: number;
    waitingCount: number;
    notPurchasedCount: number;
  };
}

export function ExitList({ exits, totals }: ExitListProps) {
  const statusCounts = [
    { status: "confirmed" as const, count: totals.confirmedCount },
    { status: "negotiating" as const, count: totals.negotiatingCount },
    { status: "waiting_purchase" as const, count: totals.waitingCount },
    { status: "not_purchased" as const, count: totals.notPurchasedCount },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-1 flex-col gap-3 overflow-hidden p-4 lg:p-3">
        {/* 集計表示 */}
        <ExitStatusSummary
          totalCount={totals.count}
          statusCounts={statusCounts}
        />

        {/* 出口管理一覧テーブル */}
        <ExitListTable exits={exits} />
      </div>
    </div>
  );
}
