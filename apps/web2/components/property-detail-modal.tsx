"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, X, Circle, ChevronDown } from "lucide-react";
import {
  ASSIGNEES,
  CONTRACT_TYPES,
  B_COMPANIES,
  BROKER_COMPANIES,
  ACCOUNT_COMPANIES,
  BANK_ACCOUNTS,
} from "@/app/(main)/properties/data/property";
import { SettlementDatePicker } from "./settlement-date-picker";

interface Property {
  id: number;
  assignee: string[];
  propertyName: string;
  roomNumber: string;
  ownerName: string;
  leadType: string;
  aAmount: number;
  exitAmount: number;
  commission: number;
  profit: number;
  bcDeposit: number;
  contractType: string;
  aContractDate: string;
  bcContractDate: string;
  settlementDate: string | null;
  buyerCompany: string;
  bCompany: string;
  brokerCompany: string;
  mortgageBank: string;
  account: "レイジット" | "ライフ" | "エムズ" | "";
  ownershipTransfer: boolean;
  accountTransfer: boolean;
  documentSent: boolean;
  workplaceDM: boolean;
  transactionLedger: boolean;
  managementCancel: boolean;
  memo: string;
  businessStatus: string;
  documentStatus: string;
}

interface PropertyDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property | null;
}

type DocumentStatus = "空欄" | "依頼" | "取得完了" | "書類なし";

interface CheckItemWithInfo {
  checked: boolean;
  date?: string;
  user?: string;
}

export function PropertyDetailModal({
  open,
  onOpenChange,
  property,
}: PropertyDetailModalProps) {
  const [aAmount, setAAmount] = useState(property?.aAmount || 0);
  const [exitAmount, setExitAmount] = useState(property?.exitAmount || 0);
  const [commission, setCommission] = useState(property?.commission || 0);
  const [assignees, setAssignees] = useState<string[]>(
    property?.assignee || []
  );
  const [settlementDate, setSettlementDate] = useState<string | null>(
    property?.settlementDate || null
  );
  const [aContractDate, setAContractDate] = useState<string>(
    property?.aContractDate || ""
  );
  const [selectedAccountCompany, setSelectedAccountCompany] = useState<string>(
    property?.account || ""
  );
  const [selectedBankAccount, setSelectedBankAccount] = useState<string>("");

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
    // 精算書関係
    loanCalculationSaved: false,
    // 司法書士関係
    lawyerRequested: false,
    documentsShared: false,
    documentsNoIssues: false,
    // 抵当銀行関係
    mortgageDocumentsNoIssues: false,
    mortgageLoanCalculationSaved: false,
    sellerPaymentCompleted: false,
    // 賃貸管理・決済後関係
    transactionLedgerRecorded: false,
  });

  // モーダルが開いたとき、またはpropertyが変わったときにデフォルト値を更新
  useEffect(() => {
    if (property && open) {
      setAAmount(property.aAmount);
      setExitAmount(property.exitAmount);
      setCommission(property.commission);
      setAssignees(property.assignee || []);
      setSettlementDate(property.settlementDate || null);
      setAContractDate(property.aContractDate || "");
      setSelectedAccountCompany(property.account || "");
      setSelectedBankAccount("");
      // デモ用にいくつかチェック済みにする
      setContractChecks({
        contractSaved: true,
        powerOfAttorneySaved: true,
        sellerIdSaved: false,
        bcContractCreated: true,
        importantMattersCreated: true,
        bcContractSent: false,
        importantMattersSent: false,
        bcContractCBCompleted: false,
        importantMattersCBCompleted: false,
      });
      setSettlementChecks({
        loanCalculationSaved: false,
        lawyerRequested: false,
        documentsShared: false,
        documentsNoIssues: false,
        mortgageDocumentsNoIssues: false,
        mortgageLoanCalculationSaved: false,
        sellerPaymentCompleted: false,
        transactionLedgerRecorded: false,
      });
    }
  }, [property, open]);

  if (!property) return null;

  const profit = exitAmount - aAmount + commission;

  const toggleAssignee = (value: string, checked: boolean) => {
    if (checked) {
      setAssignees([...assignees, value]);
    } else {
      setAssignees(assignees.filter((a) => a !== value));
    }
  };

  const formatCurrency = (value: number) => {
    return `¥${(value / 10000).toLocaleString()}万`;
  };

  const DocumentStatusBadge = ({ status }: { status: DocumentStatus }) => {
    switch (status) {
      case "取得完了":
        return (
          <Badge variant="default" className="text-xs gap-1">
            <CheckCircle2 className="w-3 h-3" />
            取得完了
          </Badge>
        );
      case "書類なし":
        return (
          <Badge variant="outline" className="text-xs gap-1">
            <X className="w-3 h-3" />
            書類なし
          </Badge>
        );
      case "依頼":
        return (
          <Badge variant="secondary" className="text-xs gap-1">
            <Circle className="w-3 h-3" />
            依頼中
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            空欄
          </Badge>
        );
    }
  };

  const CheckItemRow = ({
    label,
    checked,
    date,
    user,
    onChange,
  }: {
    label: string;
    checked: boolean;
    date?: string;
    user?: string;
    onChange?: (checked: boolean) => void;
  }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Checkbox checked={checked} onCheckedChange={onChange} />
        <Label className="cursor-pointer">{label}</Label>
      </div>
      {checked && (date || user) && (
        <div className="text-xs text-muted-foreground">
          {date && <span>{date}</span>}
          {user && <span className="ml-2">{user}</span>}
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[60vw] max-w-[1600px] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-xl">
              {property.propertyName} {property.roomNumber}
            </span>
            <Badge variant="secondary">{property.businessStatus}</Badge>
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
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label>
                  担当 <span className="text-red-500">*</span>
                </Label>
                <div className="space-y-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
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

              <div className="space-y-2">
                <Label>
                  物件名 <span className="text-red-500">*</span>
                </Label>
                <Input defaultValue={property.propertyName} />
              </div>

              <div className="space-y-2">
                <Label>号室</Label>
                <Input defaultValue={property.roomNumber} />
              </div>

              <div className="space-y-2">
                <Label>
                  オーナー名 <span className="text-red-500">*</span>
                </Label>
                <Input defaultValue={property.ownerName} />
              </div>

              <div className="space-y-2">
                <Label>A金額（万円）</Label>
                <Input
                  type="number"
                  defaultValue={property.aAmount / 10000}
                  onChange={(e) => setAAmount(Number(e.target.value) * 10000)}
                />
              </div>

              <div className="space-y-2">
                <Label>出口金額（万円）</Label>
                <Input
                  type="number"
                  defaultValue={property.exitAmount / 10000}
                  onChange={(e) =>
                    setExitAmount(Number(e.target.value) * 10000)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>仲手等（万円）</Label>
                <Input
                  type="number"
                  defaultValue={property.commission / 10000}
                  onChange={(e) =>
                    setCommission(Number(e.target.value) * 10000)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>利益（自動計算）</Label>
                <Input
                  value={formatCurrency(profit)}
                  readOnly
                  className="bg-muted font-semibold text-green-600"
                />
                <p className="text-xs text-muted-foreground">
                  出口金額 - A金額 + 仲手等
                </p>
              </div>

              <div>
                <SettlementDatePicker
                  value={aContractDate}
                  onChange={(value) => setAContractDate(value)}
                  label="A契約日"
                  placeholder="例: 2025年1月20日、1月予定"
                />
              </div>

              <div>
                <SettlementDatePicker
                  value={settlementDate || ""}
                  onChange={(value) => setSettlementDate(value)}
                  label="決済日"
                  placeholder="例: 2025年3月15日、3月予定"
                />
              </div>

              <div className="space-y-2">
                <Label>買取業者</Label>
                <Input
                  defaultValue={property.buyerCompany}
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
                <Select defaultValue={property.contractType}>
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
                <Select defaultValue={property.bCompany}>
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
                  defaultValue={property.mortgageBank}
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
                <Input defaultValue={property.leadType} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>備考</Label>
              <Textarea defaultValue={property.memo} rows={3} />
            </div>
          </TabsContent>

          {/* 契約進捗タブ */}
          <TabsContent value="contract" className="space-y-6 mt-6">
            <div className="rounded-lg border bg-card">
              <div className="p-4 border-b bg-muted/30">
                <h3 className="font-semibold">AB関係</h3>
              </div>
              <div className="p-4 space-y-1">
                <CheckItemRow
                  label="契約書 保存完了"
                  checked={contractChecks.contractSaved}
                  date={contractChecks.contractSaved ? "2025/01/10 14:30" : undefined}
                  user={contractChecks.contractSaved ? "田中" : undefined}
                  onChange={(checked) =>
                    setContractChecks({ ...contractChecks, contractSaved: checked })
                  }
                />
                <CheckItemRow
                  label="委任状関係 保存完了"
                  checked={contractChecks.powerOfAttorneySaved}
                  date={contractChecks.powerOfAttorneySaved ? "2025/01/11 10:15" : undefined}
                  user={contractChecks.powerOfAttorneySaved ? "山田" : undefined}
                  onChange={(checked) =>
                    setContractChecks({ ...contractChecks, powerOfAttorneySaved: checked })
                  }
                />
                <CheckItemRow
                  label="売主身分証 保存完了"
                  checked={contractChecks.sellerIdSaved}
                  onChange={(checked) =>
                    setContractChecks({ ...contractChecks, sellerIdSaved: checked })
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
                  date={contractChecks.bcContractCreated ? "2025/01/15 09:00" : undefined}
                  user={contractChecks.bcContractCreated ? "鈴木" : undefined}
                  onChange={(checked) =>
                    setContractChecks({ ...contractChecks, bcContractCreated: checked })
                  }
                />
                <CheckItemRow
                  label="重説作成"
                  checked={contractChecks.importantMattersCreated}
                  date={contractChecks.importantMattersCreated ? "2025/01/15 11:30" : undefined}
                  user={contractChecks.importantMattersCreated ? "鈴木" : undefined}
                  onChange={(checked) =>
                    setContractChecks({ ...contractChecks, importantMattersCreated: checked })
                  }
                />
                <CheckItemRow
                  label="BC売契送付"
                  checked={contractChecks.bcContractSent}
                  onChange={(checked) =>
                    setContractChecks({ ...contractChecks, bcContractSent: checked })
                  }
                />
                <CheckItemRow
                  label="重説送付"
                  checked={contractChecks.importantMattersSent}
                  onChange={(checked) =>
                    setContractChecks({ ...contractChecks, importantMattersSent: checked })
                  }
                />
                <CheckItemRow
                  label="BC売契CB完了"
                  checked={contractChecks.bcContractCBCompleted}
                  onChange={(checked) =>
                    setContractChecks({ ...contractChecks, bcContractCBCompleted: checked })
                  }
                />
                <CheckItemRow
                  label="重説CB完了"
                  checked={contractChecks.importantMattersCBCompleted}
                  onChange={(checked) =>
                    setContractChecks({ ...contractChecks, importantMattersCBCompleted: checked })
                  }
                />
              </div>
            </div>
          </TabsContent>

          {/* 書類進捗タブ */}
          <TabsContent value="documents" className="space-y-6 mt-6">
            <div className="rounded-lg border bg-card">
              <div className="p-4 border-b bg-muted/30">
                <h3 className="font-semibold">賃貸管理関係</h3>
              </div>
              <div className="p-4 space-y-3">
                <DocumentRow
                  label="賃貸借契約書"
                  status="取得完了"
                  date="2025/01/12"
                  user="佐藤"
                />
                <DocumentRow
                  label="管理委託契約書"
                  status="依頼"
                  date="2025/01/13"
                  user="田中"
                />
              </div>
            </div>

            <div className="rounded-lg border bg-card">
              <div className="p-4 border-b bg-muted/30">
                <h3 className="font-semibold">建物管理関係</h3>
              </div>
              <div className="p-4 space-y-3">
                <DocumentRow label="重要事項調査報告書" status="空欄" />
                <DocumentRow
                  label="管理規約"
                  status="依頼"
                  date="2025/01/14"
                  user="山田"
                />
                <DocumentRow
                  label="長期修繕計画書"
                  status="取得完了"
                  date="2025/01/15"
                  user="鈴木"
                />
                <DocumentRow
                  label="総会議事録"
                  status="書類なし"
                  date="2025/01/16"
                  user="伊藤"
                />
              </div>
            </div>

            <div className="rounded-lg border bg-card">
              <div className="p-4 border-b bg-muted/30">
                <h3 className="font-semibold">役所関係</h3>
              </div>
              <div className="p-4 space-y-3">
                <DocumentRow
                  label="公課証明"
                  status="取得完了"
                  date="2025/01/17"
                  user="小林"
                />
                <DocumentRow label="建築計画概要書" status="空欄" />
                <DocumentRow
                  label="台帳記載事項証明書"
                  status="依頼"
                  date="2025/01/18"
                  user="渡辺"
                />
                <DocumentRow label="用途地域" status="空欄" />
                <DocumentRow label="道路台帳" status="空欄" />
              </div>
            </div>

            <div className="rounded-lg border bg-card">
              <div className="p-4 border-b bg-muted/30">
                <h3 className="font-semibold">銀行関係</h3>
              </div>
              <div className="p-4 space-y-3">
                <DocumentRow
                  label="ローン計算書"
                  status="依頼"
                  date="2025/01/19"
                  user="高橋"
                />
              </div>
            </div>
          </TabsContent>

          {/* 決済進捗タブ */}
          <TabsContent value="settlement" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-6">
              {/* 左側: 決済進捗 */}
              <div className="space-y-6">
                <div className="rounded-lg border bg-card">
                  <div className="p-4 border-b bg-muted/30">
                    <h3 className="font-semibold">精算書関係</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <StageProgressRow
                      label="BC精算書"
                      stages={["作成", "送付", "CB完了"]}
                    />
                    <CheckItemRow
                      label="ローン計算書 保存"
                      checked={settlementChecks.loanCalculationSaved}
                      onChange={(checked) =>
                        setSettlementChecks({ ...settlementChecks, loanCalculationSaved: checked })
                      }
                    />
                    <StageProgressRow
                      label="AB精算書"
                      stages={["作成", "送付", "CR完了"]}
                    />
                  </div>
                </div>

                <div className="rounded-lg border bg-card">
                  <div className="p-4 border-b bg-muted/30">
                    <h3 className="font-semibold">司法書士関係</h3>
                  </div>
                  <div className="p-4 space-y-1">
                    <CheckItemRow
                      label="司法書士依頼"
                      checked={settlementChecks.lawyerRequested}
                      onChange={(checked) =>
                        setSettlementChecks({ ...settlementChecks, lawyerRequested: checked })
                      }
                    />
                    <CheckItemRow
                      label="必要書類共有"
                      checked={settlementChecks.documentsShared}
                      onChange={(checked) =>
                        setSettlementChecks({ ...settlementChecks, documentsShared: checked })
                      }
                    />
                    <StageProgressRow
                      label="本人確認書類"
                      stages={["発送", "受取", "返送"]}
                    />
                    <CheckItemRow
                      label="書類不備なし"
                      checked={settlementChecks.documentsNoIssues}
                      onChange={(checked) =>
                        setSettlementChecks({ ...settlementChecks, documentsNoIssues: checked })
                      }
                    />
                  </div>
                </div>

                <div className="rounded-lg border bg-card">
                  <div className="p-4 border-b bg-muted/30">
                    <h3 className="font-semibold">抵当銀行関係</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <StageProgressRow
                      label="抵当銀行"
                      stages={["依頼", "受付完了"]}
                    />
                    <CheckItemRow
                      label="書類不備なし"
                      checked={settlementChecks.mortgageDocumentsNoIssues}
                      onChange={(checked) =>
                        setSettlementChecks({ ...settlementChecks, mortgageDocumentsNoIssues: checked })
                      }
                    />
                    <CheckItemRow
                      label="ローン計算書 保存"
                      checked={settlementChecks.mortgageLoanCalculationSaved}
                      onChange={(checked) =>
                        setSettlementChecks({ ...settlementChecks, mortgageLoanCalculationSaved: checked })
                      }
                    />
                    <CheckItemRow
                      label="売主手出し完了"
                      checked={settlementChecks.sellerPaymentCompleted}
                      onChange={(checked) =>
                        setSettlementChecks({ ...settlementChecks, sellerPaymentCompleted: checked })
                      }
                    />
                  </div>
                </div>

                <div className="rounded-lg border bg-card">
                  <div className="p-4 border-b bg-muted/30">
                    <h3 className="font-semibold">賃貸管理・決済後関係</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <StageProgressRow
                      label="管理解約依頼"
                      stages={["依頼", "完了"]}
                    />
                    <StageProgressRow
                      label="保証会社承継"
                      stages={["依頼", "完了"]}
                    />
                    <StageProgressRow label="鍵" stages={["受取", "発送"]} />
                    <StageProgressRow
                      label="管積 口座振替手続き"
                      stages={["受取", "発送"]}
                    />
                    <CheckItemRow
                      label="取引台帳記入"
                      checked={settlementChecks.transactionLedgerRecorded}
                      onChange={(checked) =>
                        setSettlementChecks({ ...settlementChecks, transactionLedgerRecorded: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* 右側: 口座関係 */}
              <div className="space-y-6">
                <div className="rounded-lg border bg-card">
                  <div className="p-4 border-b bg-muted/30">
                    <h3 className="font-semibold">口座情報</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label>使用口座会社</Label>
                      <Select
                        value={selectedAccountCompany}
                        onValueChange={(value) => {
                          setSelectedAccountCompany(value);
                          setSelectedBankAccount(""); // 口座会社変更時に銀行口座をリセット
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(ACCOUNT_COMPANIES).map((company) => (
                            <SelectItem key={company} value={company}>
                              {company}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>使用銀行口座</Label>
                      <Select
                        value={selectedBankAccount}
                        onValueChange={setSelectedBankAccount}
                        disabled={!selectedAccountCompany}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={
                            selectedAccountCompany
                              ? "銀行口座を選択してください"
                              : "先に口座会社を選択してください"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedAccountCompany === ACCOUNT_COMPANIES.REIJIT &&
                            Object.values(BANK_ACCOUNTS.REIJIT).map((account) => (
                              <SelectItem key={account} value={account}>
                                {account}
                              </SelectItem>
                            ))}
                          {selectedAccountCompany === ACCOUNT_COMPANIES.MS &&
                            Object.values(BANK_ACCOUNTS.MS).map((account) => (
                              <SelectItem key={account} value={account}>
                                {account}
                              </SelectItem>
                            ))}
                          {selectedAccountCompany === ACCOUNT_COMPANIES.LIFE &&
                            Object.values(BANK_ACCOUNTS.LIFE).map((account) => (
                              <SelectItem key={account} value={account}>
                                {account}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="p-4 bg-muted rounded-lg space-y-2">
                      <p className="text-sm text-muted-foreground">
                        同日同口座の出口金額合計
                      </p>
                      <p className="text-2xl font-semibold">¥1,200万</p>
                      <p className="text-xs text-muted-foreground">
                        ※ 1億円を超える場合は警告が表示されます
                      </p>
                    </div>
                  </div>
                </div>
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

function DocumentRow({
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
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="空欄">空欄</SelectItem>
            <SelectItem value="依頼">依頼</SelectItem>
            <SelectItem value="取得完了">取得完了</SelectItem>
            <SelectItem value="書類なし">書類なし</SelectItem>
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
}: {
  label: string;
  stages: string[];
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      <div className="flex gap-2">
        {stages.map((stage) => (
          <Badge
            key={stage}
            variant="outline"
            className="text-xs cursor-pointer hover:bg-muted"
          >
            {stage}
          </Badge>
        ))}
      </div>
    </div>
  );
}
