"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, TrendingUp, TrendingDown } from "lucide-react";

export default function ReportsPage() {
  const [period, setPeriod] = useState("thisMonth");

  // ダミーデータ
  const summaryData = {
    thisMonth: {
      revenue: 42500000,
      profit: 8500000,
      deals: 12,
      avgDealSize: 3541666,
      lastMonth: {
        revenue: 38000000,
        profit: 7200000,
        deals: 10,
      }
    }
  };

  const salesByAssignee = [
    { name: "営業田中", deals: 4, revenue: 15200000, profit: 3040000, avgProfit: 760000 },
    { name: "営業山田", deals: 3, revenue: 12500000, profit: 2500000, avgProfit: 833333 },
    { name: "営業鈴木", deals: 3, revenue: 9800000, profit: 1960000, avgProfit: 653333 },
    { name: "営業佐藤", deals: 2, revenue: 5000000, profit: 1000000, avgProfit: 500000 },
  ];

  const monthlyTrends = [
    { month: "2024年10月", revenue: 35000000, profit: 6500000, deals: 9 },
    { month: "2024年11月", revenue: 40000000, profit: 7800000, deals: 11 },
    { month: "2024年12月", revenue: 38000000, profit: 7200000, deals: 10 },
    { month: "2025年1月", revenue: 42500000, profit: 8500000, deals: 12 },
  ];

  const formatCurrency = (value: number) => {
    return `¥${value.toLocaleString()}`;
  };

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  const current = summaryData.thisMonth;
  const previous = summaryData.thisMonth.lastMonth;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        {/* ページヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">レポート</h1>
            <p className="text-sm text-muted-foreground">売上分析・業績レポート</p>
          </div>
          <div className="flex gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="期間選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisMonth">今月</SelectItem>
                <SelectItem value="lastMonth">先月</SelectItem>
                <SelectItem value="quarter">四半期</SelectItem>
                <SelectItem value="year">年間</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              CSV出力
            </Button>
          </div>
        </div>

        {/* サマリーカード */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                売上高
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(current.revenue)}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {parseFloat(calculateChange(current.revenue, previous.revenue)) > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                前月比 {calculateChange(current.revenue, previous.revenue)}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                利益
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(current.profit)}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {parseFloat(calculateChange(current.profit, previous.profit)) > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                前月比 {calculateChange(current.profit, previous.profit)}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                成約数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{current.deals}件</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {current.deals - previous.deals > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                前月比 {current.deals - previous.deals > 0 ? '+' : ''}{current.deals - previous.deals}件
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                平均取引額
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(current.avgDealSize)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                利益率 {((current.profit / current.revenue) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 担当者別成績 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">担当者別成績</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>担当者</TableHead>
                  <TableHead>成約数</TableHead>
                  <TableHead>売上高</TableHead>
                  <TableHead>利益</TableHead>
                  <TableHead>平均利益</TableHead>
                  <TableHead>達成率</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesByAssignee.map((assignee, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{assignee.name}</TableCell>
                    <TableCell>{assignee.deals}件</TableCell>
                    <TableCell>{formatCurrency(assignee.revenue)}</TableCell>
                    <TableCell>{formatCurrency(assignee.profit)}</TableCell>
                    <TableCell>{formatCurrency(assignee.avgProfit)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-20 bg-muted rounded-full h-2 mr-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(assignee.profit / 3000000) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm">{Math.round((assignee.profit / 3000000) * 100)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 月次推移 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">月次推移</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>月</TableHead>
                  <TableHead>売上高</TableHead>
                  <TableHead>利益</TableHead>
                  <TableHead>成約数</TableHead>
                  <TableHead>利益率</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyTrends.map((month, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{month.month}</TableCell>
                    <TableCell>{formatCurrency(month.revenue)}</TableCell>
                    <TableCell>{formatCurrency(month.profit)}</TableCell>
                    <TableCell>{month.deals}件</TableCell>
                    <TableCell>{((month.profit / month.revenue) * 100).toFixed(1)}%</TableCell>
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