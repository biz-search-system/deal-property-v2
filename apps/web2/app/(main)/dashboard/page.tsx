import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function DashboardPage() {
  // ダミーデータ
  const kpiData = [
    { label: "今月売上", value: "¥12,450,000", change: "+12%" },
    { label: "今月利益", value: "¥3,200,000", change: "+8%" },
    { label: "案件数", value: "24件", change: "+3件" },
    { label: "成約率", value: "68%", change: "+5%" },
  ];

  const alerts = [
    { id: 1, type: "決済期限", message: "A物件101 - 決済日まで3日", date: "2/15" },
    { id: 2, type: "書類不備", message: "B物件202 - 重調未取得", date: "2/12" },
    { id: 3, type: "未確定", message: "C物件303 - BC業者未確定", date: "2/10" },
  ];

  const recentDeals = [
    { id: 1, property: "渋谷区物件", owner: "山田太郎", price: "¥8,500,000", status: "BC確定", profit: "¥850,000" },
    { id: 2, property: "新宿区物件", owner: "鈴木花子", price: "¥12,000,000", status: "決済完了", profit: "¥1,200,000" },
    { id: 3, property: "港区物件", owner: "佐藤次郎", price: "¥15,000,000", status: "BC未確定", profit: "¥1,500,000" },
    { id: 4, property: "品川区物件", owner: "田中美咲", price: "¥9,800,000", status: "書類待ち", profit: "¥980,000" },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        {/* ページヘッダー */}
        <div>
          <h1 className="text-2xl font-semibold">ダッシュボード</h1>
          <p className="text-sm text-muted-foreground">物上げ業務の概況</p>
        </div>

        {/* KPIカード */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((item, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  前月比 {item.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* アラートと最新案件 */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* アラート一覧 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">要対応アラート</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{alert.type}</p>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {alert.date}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 最新案件 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">最新案件</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentDeals.slice(0, 3).map((deal) => (
                  <div key={deal.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{deal.property}</p>
                      <p className="text-sm text-muted-foreground">{deal.owner}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{deal.status}</Badge>
                      <p className="text-sm text-muted-foreground mt-1">{deal.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 案件テーブル */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">進行中案件一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>物件名</TableHead>
                  <TableHead>オーナー</TableHead>
                  <TableHead>A金額</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead className="text-right">利益見込</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDeals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">{deal.property}</TableCell>
                    <TableCell>{deal.owner}</TableCell>
                    <TableCell>{deal.price}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{deal.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{deal.profit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}