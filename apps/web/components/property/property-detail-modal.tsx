"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { CheckItemRow } from "./check-item-row";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
  ASSIGNEES,
  CONTRACT_TYPES,
  B_COMPANIES,
  BROKER_COMPANIES,
} from "@/app/(main)/properties/data/property";
import { SettlementDatePicker } from "./settlement-date-picker";
import { BankAccountCard } from "./bank-account-card";
import SectionCard from "./section-card";
import type { PropertyWithRelations } from "@/lib/types/property";

// 組織の選択肢（将来的にはDBから取得）
const ORGANIZATIONS = {
  reijit: "レイジット",
  esk: "エスク",
  tousei: "TOUSEI",
} as const;

interface PropertyDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: PropertyWithRelations | null;
}

/** 書類ステータス（全体）の型 */
type DocumentOverallStatus = "営業依頼待ち" | "書類取得中" | "書類取得完了";

/** 各書類のステータスの型 */
type DocumentStatus = "未依頼" | "依頼中" | "取得済" | "不要";

export function PropertyDetailModal({
  open,
  onOpenChange,
  property,
}: PropertyDetailModalProps) {
  // 担当者の初期値を設定（staffリレーションから取得）
  const initialAssignees =
    property?.staff
      ?.map((s) => s.user?.name)
      .filter((name): name is string => !!name) || [];

  const [aAmount, setAAmount] = useState(property?.amountA || 0);
  const [exitAmount, setExitAmount] = useState(property?.amountExit || 0);
  const [commission, setCommission] = useState(property?.commission || 0);
  const [assignees, setAssignees] = useState<string[]>(initialAssignees);
  const [settlementDate, setSettlementDate] = useState<string | null>(null);
  const [aContractDate, setAContractDate] = useState<string>("");
  const [bcContractDate, setBcContractDate] = useState<string>("");

  // 契約進捗のチェック状態
  const [contractChecks, setContractChecks] = useState({
    // AB関係
    contractSaved: false,
    powerOfAttorneySaved: false,
    sellerIdSaved: false,
    // BC関係
    bcContractCreated: false,
    importantMattersCreated: false,
    bcContractSent: false,
    importantMattersSent: false,
    bcContractCBCompleted: false,
    importantMattersCBCompleted: false,
  });

  // 決済進捗のチェック状態
  const [settlementChecks, setSettlementChecks] = useState({
    // 司法書士関係
    lawyerRequested: false,
    documentsShared: false,
  });

  // 精算書関係のステージ状態
  const [settlementStages, setSettlementStages] = useState<{
    bcSettlement: { stage: string; date?: string; user?: string };
    abSettlement: { stage: string; date?: string; user?: string };
  }>({
    bcSettlement: { stage: "未作成" },
    abSettlement: { stage: "未作成" },
  });

  // ステージ変更ハンドラー
  const handleStageChange = (
    key: "bcSettlement" | "abSettlement",
    stage: string
  ) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    // 仮のユーザー名（実際にはログインユーザーから取得）
    const userName = "操作者";
    setSettlementStages((prev) => ({
      ...prev,
      [key]: { stage, date: dateStr, user: userName },
    }));
  };

  // モーダルが開いたとき、またはpropertyが変わったときにデフォルト値を更新
  useEffect(() => {
    if (property && open) {
      // 非同期で状態を更新
      Promise.resolve().then(() => {
        setAAmount(property.amountA || 0);
        setExitAmount(property.amountExit || 0);
        setCommission(property.commission || 0);
        const staffNames =
          property.staff
            ?.map((s) => s.user?.name)
            .filter((name): name is string => !!name) || [];
        setAssignees(staffNames);

        if (property.settlementDate) {
          const date = new Date(property.settlementDate);
          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
          setSettlementDate(dateStr);
        } else {
          setSettlementDate(null);
        }
        if (property.contractDateA) {
          const date = new Date(property.contractDateA);
          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
          setAContractDate(dateStr);
        } else {
          setAContractDate("");
        }
        if (property.contractDateBc) {
          const date = new Date(property.contractDateBc);
          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
          setBcContractDate(dateStr);
        } else {
          setBcContractDate("");
        }
      });
    }
  }, [property, open]);

  if (!property) return null;

  const profit = (exitAmount || 0) - (aAmount || 0) + (commission || 0);

  const toggleAssignee = (value: string, checked: boolean) => {
    if (checked) {
      setAssignees([...assignees, value]);
    } else {
      setAssignees(assignees.filter((a) => a !== value));
    }
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "-";
    // 1万円未満の場合は円単位で表示
    if (value < 10000) {
      return `${value.toLocaleString()}円`;
    }
    // 1万円以上の場合は万円単位で表示
    return `${(value / 10000).toFixed(0)}万`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[60vw] max-w-[1600px] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-xl">
              {property.propertyName} {property.roomNumber}
            </span>
            <Badge variant="secondary">{property.progressStatus}</Badge>
            <Badge variant="outline">{property.documentStatus}</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">基本情報</TabsTrigger>
            <TabsTrigger value="contract">契約進捗</TabsTrigger>
            <TabsTrigger value="documents">書類進捗</TabsTrigger>
            <TabsTrigger value="settlement">決済進捗</TabsTrigger>
          </TabsList>

          {/* 基本情報タブ */}
          <TabsContent value="basic" className="space-y-6 mt-6">
            {/* 管理組織 */}
            <SectionCard title="組織情報">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 w-full">
                <div className="space-y-2">
                  <Label>管理組織</Label>
                  <Select defaultValue={property.organizationId || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="組織を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ORGANIZATIONS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    担当 <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {assignees.length > 0
                            ? `${assignees.length}名選択中`
                            : "担当者を選択..."}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {Object.values(ASSIGNEES).map((assignee) => (
                          <DropdownMenuCheckboxItem
                            key={assignee}
                            checked={assignees.includes(assignee)}
                            onCheckedChange={(checked) =>
                              toggleAssignee(assignee, checked)
                            }
                          >
                            {assignee}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {assignees.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {assignees.map((person, index) => (
                          <Badge key={index} variant="secondary">
                            {person}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    複数の担当者を選択可能
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* 物件情報 */}
            <SectionCard title="物件情報">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 w-full">
                <div className="space-y-2">
                  <Label>
                    物件名 <span className="text-red-500">*</span>
                  </Label>
                  <Input defaultValue={property.propertyName} />
                </div>

                <div className="space-y-2">
                  <Label>号室</Label>
                  <Input defaultValue={property.roomNumber || ""} />
                </div>

                <div className="space-y-2">
                  <Label>
                    オーナー名 <span className="text-red-500">*</span>
                  </Label>
                  <Input defaultValue={property.ownerName} />
                </div>
              </div>
            </SectionCard>

            {/* 金額情報 */}
            <SectionCard title="金額情報">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 w-full">
                <div className="space-y-2">
                  <Label>A金額（万円）</Label>
                  <Input
                    type="number"
                    defaultValue={(property.amountA || 0) / 10000}
                    onChange={(e) => setAAmount(Number(e.target.value) * 10000)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>出口金額（万円）</Label>
                  <Input
                    type="number"
                    defaultValue={(property.amountExit || 0) / 10000}
                    onChange={(e) =>
                      setExitAmount(Number(e.target.value) * 10000)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>仲手等（万円）</Label>
                  <Input
                    type="number"
                    defaultValue={(property.commission || 0) / 10000}
                    onChange={(e) =>
                      setCommission(Number(e.target.value) * 10000)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>利益（自動計算）</Label>
                  <Input
                    value={`¥${formatCurrency(profit)}`}
                    readOnly
                    className="bg-muted font-semibold text-green-600"
                  />
                  <p className="text-xs text-muted-foreground">
                    出口金額 - A金額 + 仲手等
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>BC手付（万円）</Label>
                  <Input
                    type="number"
                    defaultValue={(property.bcDeposit || 0) / 10000}
                  />
                </div>
              </div>
            </SectionCard>

            {/* 契約情報 */}
            <SectionCard title="契約情報">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 w-full">
                <div className="space-y-2">
                  <Label>買取業者</Label>
                  <Input
                    defaultValue={property.buyerCompany || ""}
                    placeholder="入力中に候補が表示されます"
                    list="buyer-companies"
                  />
                  <datalist id="buyer-companies">
                    <option value="株式会社A不動産" />
                    <option value="株式会社B建設" />
                    <option value="C投資" />
                  </datalist>
                  <p className="text-xs text-muted-foreground">
                    検索方式 & 手入力可能
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>契約形態</Label>
                  <Select defaultValue={property.contractType || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="契約形態を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(CONTRACT_TYPES).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    プルダウン（後から項目追加可能）
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>B会社</Label>
                  <Select defaultValue={property.companyB || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="B会社を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(B_COMPANIES)
                        .filter((company) => company !== "")
                        .map((company) => (
                          <SelectItem key={company} value={company}>
                            {company}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    プルダウン（後から項目追加可能）
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>仲介会社</Label>
                  <Select defaultValue={property.brokerCompany || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="仲介会社を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(BROKER_COMPANIES)
                        .filter((company) => company !== "")
                        .map((company) => (
                          <SelectItem key={company} value={company}>
                            {company}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    プルダウン（後から項目追加可能）
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>抵当銀行</Label>
                  <Input
                    defaultValue={property.mortgageBank || ""}
                    placeholder="入力中に候補が表示されます"
                    list="mortgage-banks"
                  />
                  <datalist id="mortgage-banks">
                    <option value="三菱UFJ銀行" />
                    <option value="三井住友銀行" />
                    <option value="みずほ銀行" />
                    <option value="りそな銀行" />
                  </datalist>
                  <p className="text-xs text-muted-foreground">
                    検索方式 & 手入力可能
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>名簿種別</Label>
                  <Input defaultValue={property.listType || ""} />
                </div>
              </div>
            </SectionCard>

            {/* 備考 */}
            <SectionCard title="備考">
              <Textarea defaultValue={property.notes || ""} rows={3} />
            </SectionCard>
          </TabsContent>

          {/* 契約進捗タブ */}
          <TabsContent value="contract" className="space-y-6 mt-6">
            {/* スケジュール */}
            <div className="rounded-lg border bg-card">
              <div className="p-4 border-b bg-muted/30">
                <h3 className="font-semibold">スケジュール</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  <SettlementDatePicker
                    value={aContractDate}
                    onChange={(value) => setAContractDate(value)}
                    label="A契約日"
                    placeholder="例: 2025年1月20日"
                  />
                  <SettlementDatePicker
                    value={bcContractDate}
                    onChange={(value) => setBcContractDate(value)}
                    label="BC契約日"
                    placeholder="例: 2025年2月15日"
                  />
                  <SettlementDatePicker
                    value={settlementDate || ""}
                    onChange={(value) => setSettlementDate(value)}
                    label="決済日"
                    placeholder="例: 2025年3月15日"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card">
              <div className="p-4 border-b bg-muted/30">
                <h3 className="font-semibold">AB関係</h3>
              </div>
              <div className="p-4 space-y-1">
                <CheckItemRow
                  label="契約書 保存完了"
                  checked={contractChecks.contractSaved}
                  date={
                    contractChecks.contractSaved
                      ? "2025/01/10 14:30"
                      : undefined
                  }
                  user={contractChecks.contractSaved ? "田中" : undefined}
                  onChange={(checked) =>
                    setContractChecks({
                      ...contractChecks,
                      contractSaved: checked,
                    })
                  }
                />
                <CheckItemRow
                  label="委任状関係 保存完了"
                  checked={contractChecks.powerOfAttorneySaved}
                  date={
                    contractChecks.powerOfAttorneySaved
                      ? "2025/01/11 10:15"
                      : undefined
                  }
                  user={
                    contractChecks.powerOfAttorneySaved ? "山田" : undefined
                  }
                  onChange={(checked) =>
                    setContractChecks({
                      ...contractChecks,
                      powerOfAttorneySaved: checked,
                    })
                  }
                />
                <CheckItemRow
                  label="売主身分証 保存完了"
                  checked={contractChecks.sellerIdSaved}
                  onChange={(checked) =>
                    setContractChecks({
                      ...contractChecks,
                      sellerIdSaved: checked,
                    })
                  }
                />
              </div>
            </div>

            <div className="rounded-lg border bg-card">
              <div className="p-4 border-b bg-muted/30">
                <h3 className="font-semibold">BC関係</h3>
              </div>
              <div className="p-4 space-y-1">
                <CheckItemRow
                  label="BC売契作成"
                  checked={contractChecks.bcContractCreated}
                  date={
                    contractChecks.bcContractCreated
                      ? "2025/01/15 09:00"
                      : undefined
                  }
                  user={contractChecks.bcContractCreated ? "鈴木" : undefined}
                  onChange={(checked) =>
                    setContractChecks({
                      ...contractChecks,
                      bcContractCreated: checked,
                    })
                  }
                />
                <CheckItemRow
                  label="重説作成"
                  checked={contractChecks.importantMattersCreated}
                  date={
                    contractChecks.importantMattersCreated
                      ? "2025/01/15 11:30"
                      : undefined
                  }
                  user={
                    contractChecks.importantMattersCreated ? "鈴木" : undefined
                  }
                  onChange={(checked) =>
                    setContractChecks({
                      ...contractChecks,
                      importantMattersCreated: checked,
                    })
                  }
                />
                <CheckItemRow
                  label="BC売契送付"
                  checked={contractChecks.bcContractSent}
                  onChange={(checked) =>
                    setContractChecks({
                      ...contractChecks,
                      bcContractSent: checked,
                    })
                  }
                />
                <CheckItemRow
                  label="重説送付"
                  checked={contractChecks.importantMattersSent}
                  onChange={(checked) =>
                    setContractChecks({
                      ...contractChecks,
                      importantMattersSent: checked,
                    })
                  }
                />
                <CheckItemRow
                  label="BC売契CB完了"
                  checked={contractChecks.bcContractCBCompleted}
                  onChange={(checked) =>
                    setContractChecks({
                      ...contractChecks,
                      bcContractCBCompleted: checked,
                    })
                  }
                />
                <CheckItemRow
                  label="重説CB完了"
                  checked={contractChecks.importantMattersCBCompleted}
                  onChange={(checked) =>
                    setContractChecks({
                      ...contractChecks,
                      importantMattersCBCompleted: checked,
                    })
                  }
                />
              </div>
            </div>
          </TabsContent>

          {/* 書類進捗タブ */}
          <TabsContent value="documents" className="space-y-6 mt-6">
            {/* 書類ステータス（全体） */}
            <SectionCard title="書類ステータス（全体）">
              <div className="w-full">
                <Select defaultValue="書類取得中">
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="営業依頼待ち">営業依頼待ち</SelectItem>
                    <SelectItem value="書類取得中">書類取得中</SelectItem>
                    <SelectItem value="書類取得完了">書類取得完了</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </SectionCard>

            {/* 賃貸管理関係 */}
            <SectionCard title="賃貸管理関係">
              <div className="space-y-3 w-full">
                <DocumentRow
                  label="賃貸借契約書"
                  status="取得済"
                  date="2025/01/12"
                  user="佐藤"
                />
                <DocumentRow
                  label="管理委託契約書"
                  status="依頼中"
                  date="2025/01/13"
                  user="田中"
                />
                <DocumentRow label="入居申込書" status="未依頼" />
              </div>
            </SectionCard>

            {/* 建物管理関係 */}
            <SectionCard title="建物管理関係">
              <div className="space-y-3 w-full">
                <DocumentRow label="重要事項調査報告書" status="未依頼" />
                <DocumentRow
                  label="管理規約"
                  status="依頼中"
                  date="2025/01/14"
                  user="山田"
                />
                <DocumentRow
                  label="長期修繕計画書"
                  status="取得済"
                  date="2025/01/15"
                  user="鈴木"
                />
                <DocumentRow
                  label="総会議事録"
                  status="不要"
                  date="2025/01/16"
                  user="伊藤"
                />
                <DocumentRow label="パンフレット" status="未依頼" />
                <DocumentRow label="口座振替用紙" status="未依頼" />
                <DocumentRow label="所有者変更届" status="未依頼" />
              </div>
            </SectionCard>

            {/* 役所関係 */}
            <SectionCard title="役所関係">
              <div className="space-y-3 w-full">
                <DocumentRow
                  label="公課証明"
                  status="取得済"
                  date="2025/01/17"
                  user="小林"
                />
                <DocumentRow label="建築計画概要書" status="未依頼" />
                <DocumentRow
                  label="台帳記載事項証明書"
                  status="依頼中"
                  date="2025/01/18"
                  user="渡辺"
                />
                <DocumentRow label="用途地域" status="未依頼" />
                <DocumentRow label="道路台帳" status="未依頼" />
              </div>
            </SectionCard>

            {/* 銀行関係 */}
            <SectionCard title="銀行関係">
              <div className="space-y-3 w-full">
                <DocumentRow
                  label="ローン計算書"
                  status="依頼中"
                  date="2025/01/19"
                  user="高橋"
                />
              </div>
            </SectionCard>
          </TabsContent>

          {/* 決済進捗タブ */}
          <TabsContent value="settlement" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-6">
              {/* 左側: 決済進捗 */}
              <div className="space-y-6">
                {/* 精算書関係 */}
                <SectionCard title="精算書関係">
                  <div className="space-y-3 w-full">
                    <StageProgressRow
                      label="BC精算書"
                      stages={["未作成", "作成", "送付", "CB完了"]}
                      selectedStage={settlementStages.bcSettlement.stage}
                      date={settlementStages.bcSettlement.date}
                      user={settlementStages.bcSettlement.user}
                      onStageChange={(stage) =>
                        handleStageChange("bcSettlement", stage)
                      }
                    />
                    <StageProgressRow
                      label="AB精算書"
                      stages={["未作成", "作成", "送付", "CR完了"]}
                      selectedStage={settlementStages.abSettlement.stage}
                      date={settlementStages.abSettlement.date}
                      user={settlementStages.abSettlement.user}
                      onStageChange={(stage) =>
                        handleStageChange("abSettlement", stage)
                      }
                    />
                  </div>
                </SectionCard>

                {/* 司法書士関係 */}
                <SectionCard title="司法書士関係">
                  <div className="space-y-1 w-full">
                    <CheckItemRow
                      label="司法書士依頼"
                      checked={settlementChecks.lawyerRequested}
                      onChange={(checked) =>
                        setSettlementChecks({
                          ...settlementChecks,
                          lawyerRequested: checked,
                        })
                      }
                    />
                    <CheckItemRow
                      label="必要書類共有"
                      checked={settlementChecks.documentsShared}
                      onChange={(checked) =>
                        setSettlementChecks({
                          ...settlementChecks,
                          documentsShared: checked,
                        })
                      }
                    />
                  </div>
                </SectionCard>

                {/* 賃貸管理関係 */}
                <SectionCard title="賃貸管理関係">
                  <div className="grid grid-cols-1 gap-4 w-full">
                    <SettlementDatePicker
                      value=""
                      onChange={() => {}}
                      label="管理解約予定月"
                      placeholder="例: 2025年3月"
                    />
                    <SettlementDatePicker
                      value=""
                      onChange={() => {}}
                      label="管理解約依頼日"
                      placeholder="例: 2025年2月15日"
                    />
                    <SettlementDatePicker
                      value=""
                      onChange={() => {}}
                      label="管理解約完了日"
                      placeholder="例: 2025年3月1日"
                    />
                  </div>
                </SectionCard>
              </div>

              {/* 右側: 口座関係 */}
              <div className="space-y-6">
                <BankAccountCard
                  propertyId={property.id}
                  settlementDate={property.settlementDate}
                  amountExit={property.amountExit}
                  initialAccountCompany={property.accountCompany}
                  initialBankAccount={property.bankAccount}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button>保存</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DocumentRow({
  label,
  status,
  date,
  user,
}: {
  label: string;
  status: DocumentStatus;
  date?: string;
  user?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm">{label}</span>
        <Select defaultValue={status}>
          <SelectTrigger className="w-[120px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="未依頼">未依頼</SelectItem>
            <SelectItem value="依頼中">依頼中</SelectItem>
            <SelectItem value="取得済">取得済</SelectItem>
            <SelectItem value="不要">不要</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {date && user && (
        <div className="text-xs text-muted-foreground">
          {date} {user}
        </div>
      )}
    </div>
  );
}

function StageProgressRow({
  label,
  stages,
  selectedStage,
  date,
  user,
  onStageChange,
}: {
  label: string;
  stages: string[];
  selectedStage?: string;
  date?: string;
  user?: string;
  onStageChange?: (stage: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1 py-2">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-4">
        <div className="flex gap-1">
          {stages.map((stage) => (
            <Badge
              key={stage}
              variant={selectedStage === stage ? "default" : "outline"}
              className={`text-xs cursor-pointer transition-colors ${
                selectedStage === stage ? "" : "hover:bg-muted"
              }`}
              onClick={() => onStageChange?.(stage)}
            >
              {stage}
            </Badge>
          ))}
        </div>
        {selectedStage && selectedStage !== stages[0] && date && user ? (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {date} {user}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground whitespace-nowrap invisible">
            0000/00/00 00:00 ユーザー
          </span>
        )}
      </div>
    </div>
  );
}
