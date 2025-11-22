import { Card, CardContent } from "@workspace/ui/components/card";
import { getProperties } from "@/lib/data/property";
import { UnconfirmedPropertiesTable } from "@/components/property/unconfirmed-properties-table";

export default async function UnconfirmedPropertiesPage() {
  // BC確定前の案件のみフィルター
  const allProperties = await getProperties();
  // console.log(allProperties);
  const unconfirmedProperties = allProperties.filter(
    (p) => p.progressStatus === "bc_before_confirmed"
  );

  // 集計計算（利益はprofitフィールドから直接取得）
  const totals = {
    profitEstimate: unconfirmedProperties.reduce((sum, p) => {
      return sum + (p.profit || 0);
    }, 0),
    count: unconfirmedProperties.length,
  };

  const formatCurrency = (value: number) => {
    if (!value) return "0円";
    // 1万円未満の場合は円単位で表示
    if (value < 10000) {
      return `${value.toLocaleString()}円`;
    }
    // 1万円以上の場合は万円単位で表示
    return `${(value / 10000).toFixed(0)}万`;
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-col gap-3 p-4 lg:p-3">
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
        <Card className="p-3 py-2">
          <CardContent className="p-0">
            <UnconfirmedPropertiesTable properties={unconfirmedProperties} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
