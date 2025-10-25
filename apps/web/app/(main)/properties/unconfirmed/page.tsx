import { Card, CardContent } from "@workspace/ui/components/card";
import { getProperties } from "@/lib/data/property";
import { UnconfirmedPropertiesTable } from "@/components/property/unconfirmed-properties-table";

export default async function UnconfirmedPropertiesPage() {
  // BC確定前の案件のみフィルター
  const allProperties = await getProperties();
  const unconfirmedProperties = allProperties.filter(
    (p) => p.progressStatus === "bc_before_confirmed"
  );

  // 集計計算
  const totals = {
    profitEstimate: unconfirmedProperties.reduce(
      (sum, p) => sum + (p.profit || 0),
      0
    ),
    count: unconfirmedProperties.length,
  };

  const formatCurrency = (value: number) => {
    return value ? `${(value / 10000).toFixed(0)}万` : "-";
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-col gap-4 p-4 lg:p-6">
        {/* 集計表示（2カラム） */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted/50 p-3 border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                利益見込み合計
              </span>
              <p className="text-sm font-bold">
                {formatCurrency(totals.profitEstimate)}
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">件数</span>
              <p className="text-sm font-bold">{totals.count}件</p>
            </div>
          </div>
        </div>

        {/* 案件一覧テーブル */}
        <Card>
          <CardContent className="pt-6">
            <UnconfirmedPropertiesTable properties={unconfirmedProperties} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
