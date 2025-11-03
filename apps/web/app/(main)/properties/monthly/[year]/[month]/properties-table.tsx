"use client";

import { Badge } from "@workspace/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { MoreVertical, Eye, Edit } from "lucide-react";
import type { PropertyWithRelations } from "@/lib/types/property";
import { useRouter } from "next/navigation";

interface PropertiesTableProps {
  properties: PropertyWithRelations[];
  editingMemo: { id: string; value: string } | null;
  editingBusinessStatus: { id: string; value: string } | null;
  editingDocumentStatus: { id: string; value: string } | null;
  setEditingMemo: (value: { id: string; value: string } | null) => void;
  setEditingBusinessStatus: (
    value: { id: string; value: string } | null
  ) => void;
  setEditingDocumentStatus: (
    value: { id: string; value: string } | null
  ) => void;
  handleMemoSave: (propertyId: string) => void;
  handleBusinessStatusSave: (propertyId: string) => void;
  handleDocumentStatusSave: (propertyId: string) => void;
  handlePropertyClick: (property: PropertyWithRelations) => void;
  formatCurrency: (value: number | null | undefined) => string;
  formatDateWithDay: (dateString: string | Date | null) => string;
  truncateText: (text: string | null | undefined, maxLength?: number) => string;
  getProgressStatusLabel: (status: string) => string;
  getDocumentStatusLabel: (status: string) => string;
  getProgressStatusColor: (
    status: string
  ) => "default" | "secondary" | "outline";
  getDocumentStatusColor: (
    status: string
  ) => "default" | "secondary" | "outline";
  getContractTypeLabel: (type: string | null) => string;
  getCompanyBLabel: (company: string | null) => string;
  getBrokerCompanyLabel: (company: string | null) => string;

  year: string;
  month: string;
}

export function PropertiesTable({
  properties,
  editingMemo,
  editingBusinessStatus,
  editingDocumentStatus,
  setEditingMemo,
  setEditingBusinessStatus,
  setEditingDocumentStatus,
  handleMemoSave,
  handleBusinessStatusSave,
  handleDocumentStatusSave,
  handlePropertyClick,
  formatCurrency,
  formatDateWithDay,
  truncateText,
  getProgressStatusLabel,
  getDocumentStatusLabel,
  getProgressStatusColor,
  getDocumentStatusColor,
  getContractTypeLabel,
  getCompanyBLabel,
  getBrokerCompanyLabel,
  year,
  month,
}: PropertiesTableProps) {
  const router = useRouter();
  return (
    <div className="overflow-auto max-h-[calc(100vh-500px)]">
      <Table className="text-[10px]">
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="text-[10px] p-1 sticky left-0 bg-background z-20 min-w-[50px]">
              管理組織
            </TableHead>
            <TableHead className="text-[10px] p-1 sticky left-[50px] bg-background z-20 min-w-[45px]">
              担当
            </TableHead>
            <TableHead className="text-[10px] p-1 sticky left-[95px] bg-background z-20 min-w-[65px]">
              物件名
            </TableHead>
            <TableHead className="text-[10px] p-1 sticky left-[160px] bg-background z-20 w-[40px]">
              号室
            </TableHead>
            <TableHead className="text-[10px] p-1 min-w-[55px]">
              オーナー
            </TableHead>
            <TableHead className="text-[10px] p-1 w-[50px]">A金額</TableHead>
            <TableHead className="text-[10px] p-1 w-[50px]">出口</TableHead>
            <TableHead className="text-[10px] p-1 w-[50px]">仲手等</TableHead>
            <TableHead className="text-[10px] p-1 w-[50px]">利益</TableHead>
            <TableHead className="text-[10px] p-1 w-[50px]">BC手付</TableHead>
            <TableHead className="text-[10px] p-1 min-w-[50px]">
              決済日
            </TableHead>
            <TableHead className="text-[10px] p-1 min-w-[50px]">買取</TableHead>
            <TableHead className="text-[10px] p-1 min-w-[45px]">
              契約形態
            </TableHead>
            <TableHead className="text-[10px] p-1 min-w-[45px]">
              B会社
            </TableHead>
            <TableHead className="text-[10px] p-1 min-w-[45px]">仲介</TableHead>
            <TableHead className="text-[10px] p-1 min-w-[50px]">進捗</TableHead>
            <TableHead className="text-[10px] p-1 min-w-[50px]">書類</TableHead>
            <TableHead className="text-[10px] p-1 w-[120px]">備考</TableHead>
            <TableHead className="text-[10px] p-1 sticky right-0 bg-background z-20 min-w-[35px]">
              操作
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id} className="hover:bg-muted/50">
              <TableCell className="text-[10px] p-1 sticky left-0 bg-background">
                <Badge variant="outline" className="text-[9px] px-1 py-0">
                  {property.organization.name ||
                    property.organizationId?.slice(0, 3) ||
                    "レイジット"}
                </Badge>
              </TableCell>
              <TableCell className="text-[10px] p-1 sticky left-[50px] bg-background">
                <div className="flex gap-1 flex-wrap">
                  {property.staff.map((staffMember, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-[9px] px-1 py-0"
                    >
                      {staffMember.user?.name || "担当者"}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-[10px] p-1 sticky left-[95px] bg-background">
                {property.propertyName}
              </TableCell>
              <TableCell className="text-[10px] p-1 sticky left-[160px] bg-background">
                {property.roomNumber}
              </TableCell>
              <TableCell className="text-[10px] p-1">
                {property.ownerName}
              </TableCell>
              <TableCell className="text-[10px] p-1 text-right">
                {formatCurrency(property.amountA)}
              </TableCell>
              <TableCell className="text-[10px] p-1 text-right">
                {formatCurrency(property.amountExit)}
              </TableCell>
              <TableCell className="text-[10px] p-1 text-right">
                {formatCurrency(property.commission)}
              </TableCell>
              <TableCell className="text-[10px] p-1 text-right font-semibold">
                {formatCurrency(property.profit)}
              </TableCell>
              <TableCell className="text-[10px] p-1 text-right">
                {formatCurrency(property.bcDeposit)}
              </TableCell>
              <TableCell className="text-[10px] p-1">
                {formatDateWithDay(property.settlementDate || "")}
              </TableCell>
              <TableCell className="text-[10px] p-1">
                <Badge variant="outline" className="text-[9px] px-1 py-0">
                  {truncateText(property.buyerCompany)}
                </Badge>
              </TableCell>
              <TableCell className="text-[10px] p-1">
                <Badge variant="outline" className="text-[9px] px-1 py-0">
                  {truncateText(getContractTypeLabel(property.contractType))}
                </Badge>
              </TableCell>
              <TableCell className="text-[10px] p-1">
                <Badge variant="outline" className="text-[9px] px-1 py-0">
                  {truncateText(getCompanyBLabel(property.companyB))}
                </Badge>
              </TableCell>
              <TableCell className="text-[10px] p-1">
                <Badge variant="outline" className="text-[9px] px-1 py-0">
                  {truncateText(getBrokerCompanyLabel(property.brokerCompany))}
                </Badge>
              </TableCell>
              <TableCell className="text-[10px] p-1">
                {editingBusinessStatus?.id === property.id ? (
                  <Select
                    value={editingBusinessStatus.value}
                    onValueChange={(value) => {
                      setEditingBusinessStatus({
                        ...editingBusinessStatus,
                        value,
                      });
                      handleBusinessStatusSave(property.id);
                    }}
                  >
                    <SelectTrigger className="h-5 text-[10px] p-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "contract_cb_waiting",
                        "bc_contract_waiting",
                        "settlement_date_waiting",
                        "settlement_cb_waiting",
                        "settlement_waiting",
                        "settlement_completed",
                      ].map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          className="text-[10px]"
                        >
                          {getProgressStatusLabel(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge
                    variant={getProgressStatusColor(property.progressStatus)}
                    className="text-[9px] cursor-pointer px-1 py-0"
                    onClick={() =>
                      setEditingBusinessStatus({
                        id: property.id,
                        value: property.progressStatus,
                      })
                    }
                  >
                    {truncateText(
                      getProgressStatusLabel(property.progressStatus),
                      6
                    )}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-[10px] p-1">
                {editingDocumentStatus?.id === property.id ? (
                  <Select
                    value={editingDocumentStatus.value}
                    onValueChange={(value) => {
                      setEditingDocumentStatus({
                        ...editingDocumentStatus,
                        value,
                      });
                      handleDocumentStatusSave(property.id);
                    }}
                  >
                    <SelectTrigger className="h-5 text-[10px] p-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["waiting_request", "in_progress", "all_completed"].map(
                        (status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="text-[10px]"
                          >
                            {getDocumentStatusLabel(status)}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge
                    variant={getDocumentStatusColor(property.documentStatus)}
                    className="text-[9px] cursor-pointer px-1 py-0"
                    onClick={() =>
                      setEditingDocumentStatus({
                        id: property.id,
                        value: property.documentStatus,
                      })
                    }
                  >
                    {truncateText(
                      getDocumentStatusLabel(property.documentStatus),
                      6
                    )}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-[10px] p-1">
                {editingMemo?.id === property.id ? (
                  <Input
                    value={editingMemo.value}
                    onChange={(e) =>
                      setEditingMemo({ ...editingMemo, value: e.target.value })
                    }
                    className="h-5 text-[10px] p-1"
                    onBlur={() => handleMemoSave(property.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleMemoSave(property.id);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <div
                    className="cursor-pointer hover:bg-muted px-1 rounded text-[10px] truncate break-all max-w-[120px]"
                    onClick={() =>
                      setEditingMemo({
                        id: property.id,
                        value: property.notes || "",
                      })
                    }
                    title={property.notes || ""}
                  >
                    {property.notes || (
                      <span className="text-muted-foreground">入力</span>
                    )}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-[10px] p-1 sticky right-0 bg-background">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                      <MoreVertical className="h-3 w-3" />
                      <span className="sr-only">操作メニュー</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        router.push(
                          `/properties/monthly/${year}/${month}/${property.id}`
                        );
                      }}
                    >
                      <Eye className="h-3 w-3" />
                      詳細
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handlePropertyClick(property)}
                    >
                      <Edit className="h-3 w-3" />
                      編集
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
