"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function FirmsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // ダミーデータ
  const firms = [
    {
      id: 1,
      name: "株式会社A不動産",
      type: "買取業者",
      avgPrice: 12500000,
      responseRate: 85,
      totalDeals: 45,
      successRate: 72,
      lastDealDate: "2025-01-20",
      contact: "担当：佐藤",
      phone: "03-1234-5678",
    },
    {
      id: 2,
      name: "B建設株式会社",
      type: "買取業者",
      avgPrice: 10800000,
      responseRate: 92,
      totalDeals: 38,
      successRate: 68,
      lastDealDate: "2025-01-18",
      contact: "担当：田中",
      phone: "03-2345-6789",
    },
    {
      id: 3,
      name: "Cホールディングス",
      type: "仲介会社",
      avgPrice: 14200000,
      responseRate: 78,
      totalDeals: 29,
      successRate: 80,
      lastDealDate: "2025-01-15",
      contact: "担当：山田",
      phone: "03-3456-7890",
    },
    {
      id: 4,
      name: "D不動産投資",
      type: "買取業者",
      avgPrice: 11300000,
      responseRate: 88,
      totalDeals: 52,
      successRate: 75,
      lastDealDate: "2025-01-22",
      contact: "担当：鈴木",
      phone: "03-4567-8901",
    },
  ];

  const formatCurrency = (value: number) => {
    return `¥${value.toLocaleString()}`;
  };

  const filteredFirms = firms.filter(firm =>
    firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    firm.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 統計情報
  const stats = {
    totalFirms: firms.length,
    avgResponseRate: Math.round(firms.reduce((acc, f) => acc + f.responseRate, 0) / firms.length),
    totalDeals: firms.reduce((acc, f) => acc + f.totalDeals, 0),
    avgSuccessRate: Math.round(firms.reduce((acc, f) => acc + f.successRate, 0) / firms.length),
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        {/* ページヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">業者管理</h1>
            <p className="text-sm text-muted-foreground">買取業者・仲介会社の管理</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規業者登録
          </Button>
        </div>

        {/* 統計情報 */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                登録業者数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFirms}社</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                平均回答率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgResponseRate}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                総取引数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDeals}件</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                平均成約率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgSuccessRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* 検索 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="会社名・種別で検索"
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 業者一覧 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">業者一覧</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>会社名</TableHead>
                  <TableHead>種別</TableHead>
                  <TableHead>平均買取価格</TableHead>
                  <TableHead>回答率</TableHead>
                  <TableHead>取引数</TableHead>
                  <TableHead>成約率</TableHead>
                  <TableHead>最終取引</TableHead>
                  <TableHead>連絡先</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFirms.map((firm) => (
                  <TableRow key={firm.id}>
                    <TableCell className="font-medium">{firm.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{firm.type}</Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(firm.avgPrice)}</TableCell>
                    <TableCell>{firm.responseRate}%</TableCell>
                    <TableCell>{firm.totalDeals}件</TableCell>
                    <TableCell>{firm.successRate}%</TableCell>
                    <TableCell>{firm.lastDealDate}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{firm.contact}</p>
                        <p className="text-muted-foreground">{firm.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">詳細</Button>
                    </TableCell>
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