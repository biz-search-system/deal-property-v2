"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { SettlementDatePicker } from "@/components/settlement-date-picker";
import {
  ASSIGNEES,
  CONTRACT_TYPES,
  B_COMPANIES,
  BROKER_COMPANIES,
  ACCOUNT_COMPANIES,
  BANK_ACCOUNTS,
} from "../data/property";

export default function NewPropertyPage() {
  const router = useRouter();
  const [assignees, setAssignees] = useState<string[]>([]);
  const [propertyName, setPropertyName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [aAmount, setAAmount] = useState("");
  const [exitAmount, setExitAmount] = useState("");
  const [commission, setCommission] = useState("");
  const [contractType, setContractType] = useState("");
  const [bCompany, setBCompany] = useState("");
  const [brokerCompany, setBrokerCompany] = useState("");
  const [buyerCompany, setBuyerCompany] = useState("");
  const [mortgageBank, setMortgageBank] = useState("");
  const [aContractDate, setAContractDate] = useState("");
  const [settlementDate, setSettlementDate] = useState("");
  const [accountCompany, setAccountCompany] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [memo, setMemo] = useState("");

  const toggleAssignee = (value: string, checked: boolean) => {
    if (checked) {
      setAssignees([...assignees, value]);
    } else {
      setAssignees(assignees.filter((a) => a !== value));
    }
  };

  const calculateProfit = () => {
    const exit = Number(exitAmount) || 0;
    const a = Number(aAmount) || 0;
    const comm = Number(commission) || 0;
    return exit - a + comm;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: ここでサーバーアクションを呼び出してデータを保存
    console.log("Submitting property data:", {
      assignees,
      propertyName,
      roomNumber,
      ownerName,
      aAmount,
      exitAmount,
      commission,
      contractType,
      bCompany,
      brokerCompany,
      buyerCompany,
      mortgageBank,
      aContractDate,
      settlementDate,
      accountCompany,
      bankAccount,
      memo,
    });

    // 登録後、一覧ページに戻る
    router.push("/properties/unconfirmed");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/properties/unconfirmed")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              キャンセル
            </Button>
            <h1 className="text-lg font-semibold">新規案件登録</h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 基本情報 */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">基本情報</h2>
              <p className="text-sm text-muted-foreground">
                案件の基本的な情報を入力してください
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assignees">
                  担当 <span className="text-red-500">*</span>
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {assignees.length > 0
                        ? `${assignees.length}名選択中`
                        : "担当者を選択..."}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
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
                  <div className="flex flex-wrap gap-2 mt-2">
                    {assignees.map((person, index) => (
                      <Badge key={index} variant="secondary">
                        {person}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyName">
                    物件名 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="propertyName"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    placeholder="例: グランドメゾン"
                    required
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roomNumber">号室</Label>
                  <Input
                    id="roomNumber"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="例: 101"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerName">
                  オーナー名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ownerName"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="オーナーの氏名を入力"
                  required
                  autoComplete="off"
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* 金額情報 */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">金額情報</h2>
              <p className="text-sm text-muted-foreground">
                取引に関する金額を入力してください（万円単位）
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aAmount">A金額（万円）</Label>
                  <Input
                    id="aAmount"
                    type="number"
                    value={aAmount}
                    onChange={(e) => setAAmount(e.target.value)}
                    placeholder="0"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exitAmount">出口金額（万円）</Label>
                  <Input
                    id="exitAmount"
                    type="number"
                    value={exitAmount}
                    onChange={(e) => setExitAmount(e.target.value)}
                    placeholder="0"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commission">仲手等（万円）</Label>
                  <Input
                    id="commission"
                    type="number"
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    placeholder="0"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">利益見込み（自動計算）</span>
                  <span className="text-2xl font-bold text-green-600">
                    ¥{calculateProfit().toLocaleString()}万
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  出口金額 - A金額 + 仲手等
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* 契約情報 */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">契約情報</h2>
              <p className="text-sm text-muted-foreground">
                契約に関する情報を入力してください
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contractType">契約形態</Label>
                  <Select value={contractType} onValueChange={setContractType}>
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(CONTRACT_TYPES).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bCompany">B会社</Label>
                  <Select value={bCompany} onValueChange={setBCompany}>
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
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
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buyerCompany">買取業者</Label>
                  <Input
                    id="buyerCompany"
                    value={buyerCompany}
                    onChange={(e) => setBuyerCompany(e.target.value)}
                    placeholder="買取業者名を入力"
                    list="buyer-companies"
                    autoComplete="off"
                  />
                  <datalist id="buyer-companies">
                    <option value="株式会社A不動産" />
                    <option value="株式会社B建設" />
                    <option value="C投資" />
                  </datalist>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brokerCompany">仲介会社</Label>
                  <Select value={brokerCompany} onValueChange={setBrokerCompany}>
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
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
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mortgageBank">抵当銀行</Label>
                <Input
                  id="mortgageBank"
                  value={mortgageBank}
                  onChange={(e) => setMortgageBank(e.target.value)}
                  placeholder="銀行名を入力"
                  list="mortgage-banks"
                  autoComplete="off"
                />
                <datalist id="mortgage-banks">
                  <option value="三菱UFJ銀行" />
                  <option value="三井住友銀行" />
                  <option value="みずほ銀行" />
                  <option value="りそな銀行" />
                </datalist>
              </div>
            </div>
          </section>

          <Separator />

          {/* スケジュール */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">スケジュール</h2>
              <p className="text-sm text-muted-foreground">
                契約日や決済予定日を入力してください
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <SettlementDatePicker
                  value={aContractDate}
                  onChange={setAContractDate}
                  label="A契約日"
                  placeholder="例: 2025年1月20日、1月予定"
                />

                <SettlementDatePicker
                  value={settlementDate}
                  onChange={setSettlementDate}
                  label="決済予定日"
                  placeholder="例: 2025年3月15日、3月予定"
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* 口座情報 */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">口座情報</h2>
              <p className="text-sm text-muted-foreground">
                使用する口座を選択してください
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountCompany">使用口座会社</Label>
                  <Select
                    value={accountCompany}
                    onValueChange={(value) => {
                      setAccountCompany(value);
                      setBankAccount("");
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
                  <Label htmlFor="bankAccount">使用銀行口座</Label>
                  <Select
                    value={bankAccount}
                    onValueChange={setBankAccount}
                    disabled={!accountCompany}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          accountCompany
                            ? "銀行口座を選択してください"
                            : "先に口座会社を選択してください"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {accountCompany === ACCOUNT_COMPANIES.REIJIT &&
                        Object.values(BANK_ACCOUNTS.REIJIT).map((account) => (
                          <SelectItem key={account} value={account}>
                            {account}
                          </SelectItem>
                        ))}
                      {accountCompany === ACCOUNT_COMPANIES.MS &&
                        Object.values(BANK_ACCOUNTS.MS).map((account) => (
                          <SelectItem key={account} value={account}>
                            {account}
                          </SelectItem>
                        ))}
                      {accountCompany === ACCOUNT_COMPANIES.LIFE &&
                        Object.values(BANK_ACCOUNTS.LIFE).map((account) => (
                          <SelectItem key={account} value={account}>
                            {account}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* 備考 */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">備考</h2>
              <p className="text-sm text-muted-foreground">
                その他の情報を入力してください
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="memo">備考</Label>
              <Textarea
                id="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="メモや注意事項を入力..."
                rows={4}
              />
            </div>
          </section>

          {/* アクションボタン */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/properties/unconfirmed")}
            >
              キャンセル
            </Button>
            <Button type="submit">登録する</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
