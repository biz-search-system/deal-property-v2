"use client";

import { useState } from "react";
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
import { useRouter } from "next/navigation";
import type { PropertyWithRelations } from "@/lib/types/property";
import {
  updatePropertyProgressStatus,
  updatePropertyDocumentStatus,
  updatePropertyNotes,
} from "@/lib/actions/property";
import { toast } from "sonner";
import {
  PROGRESS_STATUS_LABELS,
  DOCUMENT_STATUS_LABELS,
} from "@workspace/drizzle/constants";
import ContractTypeBadge from "./badge/contract-type-badge";
import CompanyBBadge from "./badge/company-b-badge";
import BrokerCompanyBadge from "./badge/broker-company-badge";
import ProgressStatusBadge from "./progress-status-badge";
import DocumentStatusBadge from "./badge/document-status-badge";
interface UnconfirmedPropertiesTableProps {
  properties: PropertyWithRelations[];
}

export function UnconfirmedPropertiesTable({
  properties,
}: UnconfirmedPropertiesTableProps) {
  const router = useRouter();
  const [editingNotes, setEditingNotes] = useState<{
    id: string;
    value: string;
  } | null>(null);
  const [editingProgressStatus, setEditingProgressStatus] = useState<{
    id: string;
    value: string;
  } | null>(null);
  const [editingDocumentStatus, setEditingDocumentStatus] = useState<{
    id: string;
    value: string;
  } | null>(null);

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return "-";
    // 1万円未満の場合は円単位で表示
    if (value < 10000) {
      return `${value.toLocaleString()}円`;
    }
    // 1万円以上の場合は万円単位で表示
    return `${(value / 10000).toFixed(0)}万`;
  };

  const handleNotesSave = async (propertyId: string) => {
    if (!editingNotes) return;

    try {
      await updatePropertyNotes({
        id: propertyId,
        notes: editingNotes.value,
      });
      toast.success("備考を更新しました");
      setEditingNotes(null);
    } catch (error) {
      toast.error("備考の更新に失敗しました");
      console.error(error);
    }
  };

  const handleProgressStatusSave = async (
    propertyId: string,
    newStatus: string
  ) => {
    try {
      await updatePropertyProgressStatus({
        id: propertyId,
        progressStatus: newStatus,
      });
      toast.success("進捗ステータスを更新しました");
      setEditingProgressStatus(null);
    } catch (error) {
      toast.error("進捗ステータスの更新に失敗しました");
      console.error(error);
    }
  };

  const handleDocumentStatusSave = async (
    propertyId: string,
    newStatus: string
  ) => {
    try {
      await updatePropertyDocumentStatus({
        id: propertyId,
        documentStatus: newStatus,
      });
      toast.success("書類ステータスを更新しました");
      setEditingDocumentStatus(null);
    } catch (error) {
      toast.error("書類ステータスの更新に失敗しました");
      console.error(error);
    }
  };

  return (
    <div className="overflow-auto max-h-[calc(100vh-400px)]">
      <Table className="text-[10px]">
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="text-[10px] p-1 sticky left-0 bg-background z-20 min-w-[50px]">
              管理組織
            </TableHead>
            <TableHead className="text-[10px] p-1 min-w-[45px]">担当</TableHead>
            <TableHead className="text-[10px] p-1 min-w-[65px]">
              物件名
            </TableHead>
            <TableHead className="text-[10px] p-1 w-[40px]">号室</TableHead>
            <TableHead className="text-[10px] p-1 min-w-[55px]">
              オーナー
            </TableHead>
            <TableHead className="text-[10px] p-1 w-[50px]">A金額</TableHead>
            <TableHead className="text-[10px] p-1 w-[50px]">出口</TableHead>
            <TableHead className="text-[10px] p-1 w-[50px]">仲手等</TableHead>
            <TableHead className="text-[10px] p-1 w-[50px]">利益</TableHead>
            <TableHead className="text-[10px] p-1 min-w-[45px]">
              契約形態
            </TableHead>
            <TableHead className="text-[10px] p-1 min-w-[45px]">
              B会社
            </TableHead>
            <TableHead className="text-[10px] p-1 min-w-[50px]">仲介</TableHead>
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
              {/* 管理組織 */}
              <TableCell className="text-[10px] p-1">
                <Badge variant="outline" className="text-[9px] px-1 py-0">
                  {property.organization?.name || "-"}
                </Badge>
              </TableCell>

              {/* 担当 */}
              <TableCell className="text-[10px] p-1 sticky left-0 bg-background">
                <div className="flex gap-1 flex-wrap">
                  {property.staff.map((staff) => (
                    <Badge
                      key={staff.user.id}
                      variant="outline"
                      className="text-[9px] px-1 py-0"
                    >
                      {staff.user.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              {/* 物件名 */}
              <TableCell className="text-[10px] p-1">
                {property.propertyName}
              </TableCell>

              {/* 号室 */}
              <TableCell className="text-[10px] p-1">
                {property.roomNumber || "-"}
              </TableCell>

              {/* オーナー */}
              <TableCell className="text-[10px] p-1">
                {property.ownerName}
              </TableCell>

              {/* A金額 */}
              <TableCell className="text-[10px] p-1 text-right">
                {formatCurrency(property.amountA)}
              </TableCell>

              {/* 出口 */}
              <TableCell className="text-[10px] p-1 text-right">
                {formatCurrency(property.amountExit)}
              </TableCell>

              {/* 仲手等 */}
              <TableCell className="text-[10px] p-1 text-right">
                {formatCurrency(property.commission)}
              </TableCell>

              {/* 利益 */}
              <TableCell className="text-[10px] p-1 text-right font-semibold">
                {formatCurrency(property.profit)}
              </TableCell>

              {/* 契約形態 */}
              <TableCell className="text-[10px] p-1">
                <ContractTypeBadge contractType={property.contractType} />
              </TableCell>

              {/* B会社 */}
              <TableCell className="text-[10px] p-1">
                <CompanyBBadge companyB={property.companyB} />
              </TableCell>

              {/* 仲介 */}
              <TableCell className="text-[10px] p-1">
                <BrokerCompanyBadge brokerCompany={property.brokerCompany} />
              </TableCell>

              {/* 進捗（インライン編集） */}
              <TableCell className="text-[10px] p-1">
                {editingProgressStatus?.id === property.id ? (
                  <Select
                    value={editingProgressStatus.value}
                    onValueChange={(value) => {
                      handleProgressStatusSave(property.id, value);
                    }}
                  >
                    <SelectTrigger className="h-5 text-[10px] p-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PROGRESS_STATUS_LABELS)
                        .filter(([key]) => key !== "bc_before_confirmed")
                        .map(([key, label]) => (
                          <SelectItem
                            key={key}
                            value={key}
                            className="text-[10px]"
                          >
                            {label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <ProgressStatusBadge
                    progressStatus={property.progressStatus}
                    onClick={() =>
                      setEditingProgressStatus({
                        id: property.id,
                        value: property.progressStatus,
                      })
                    }
                  />
                )}
              </TableCell>

              {/* 書類（インライン編集） */}
              <TableCell className="text-[10px] p-1">
                {editingDocumentStatus?.id === property.id ? (
                  <Select
                    value={editingDocumentStatus.value}
                    onValueChange={(value) => {
                      handleDocumentStatusSave(property.id, value);
                    }}
                  >
                    <SelectTrigger className="h-5 text-[10px] p-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DOCUMENT_STATUS_LABELS).map(
                        ([key, label]) => (
                          <SelectItem
                            key={key}
                            value={key}
                            className="text-[10px]"
                          >
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                ) : (
                  <DocumentStatusBadge
                    documentStatus={property.documentStatus}
                    onClick={() =>
                      setEditingDocumentStatus({
                        id: property.id,
                        value: property.documentStatus,
                      })
                    }
                  />
                )}
              </TableCell>

              {/* 備考（インライン編集） */}
              <TableCell className="text-[10px] p-1">
                {editingNotes?.id === property.id ? (
                  <Input
                    value={editingNotes.value}
                    onChange={(e) =>
                      setEditingNotes({
                        ...editingNotes,
                        value: e.target.value,
                      })
                    }
                    className="h-5 text-[10px] p-1"
                    onBlur={() => handleNotesSave(property.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleNotesSave(property.id);
                      } else if (e.key === "Escape") {
                        setEditingNotes(null);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <div
                    className="cursor-pointer hover:bg-muted px-1 rounded text-[10px] truncate break-all max-w-[120px]"
                    onClick={() =>
                      setEditingNotes({
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

              {/* 操作 */}
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
                        router.push(`/properties/unconfirmed/${property.id}`);
                      }}
                    >
                      <Eye className="h-3 w-3" />
                      詳細
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push(`/properties/${property.id}/edit`);
                      }}
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
