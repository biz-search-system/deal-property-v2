"use client";

import type { PropertyWithRelations } from "@/lib/types/property";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { OrganizationNameType } from "@workspace/utils";
import { Edit, Eye, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import BrokerCompanyBadge from "./badge/broker-company-badge";
import CompanyBBadge from "./badge/company-b-badge";
import ContractTypeBadge from "./badge/contract-type-badge";
import OrganizationBadge from "./badge/organization-badge";
import { DocumentStatusInlineEdit } from "./inline-edit/document-status-inline-edit";
import { NotesPopoverEdit } from "./inline-edit/notes-popover-edit";
import { ProgressStatusInlineEdit } from "./inline-edit/progress-status-inline-edit";
import { PopoverProvider, PropertyNameCell } from "./property-name-cell";
interface UnconfirmedPropertiesTableProps {
  properties: PropertyWithRelations[];
}

export function UnconfirmedPropertiesTable({
  properties,
}: UnconfirmedPropertiesTableProps) {
  const router = useRouter();

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return "-";
    // 1万円未満の場合は円単位で表示
    if (value < 10000) {
      return `${value.toLocaleString()}円`;
    }
    // 1万円以上の場合は万円単位で表示
    return `${(value / 10000).toFixed(0)}万`;
  };

  return (
    <div className="overflow-auto max-h-[calc(100vh-400px)]">
      <PopoverProvider>
        <Table className="text-[10px]">
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="text-[10px] p-1 sticky left-0 bg-background z-20 w-[70px]">
                管理組織
              </TableHead>
              <TableHead className="text-[10px] p-1 min-w-[45px] w-[70px]">
                担当
              </TableHead>
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
              <TableHead className="text-[10px] p-1 w-[70px]">
                契約形態
              </TableHead>
              <TableHead className="text-[10px] p-1 w-[70px]">B会社</TableHead>
              <TableHead className="text-[10px] p-1 w-[70px]">仲介</TableHead>
              <TableHead className="text-[10px] p-1 w-[70px]">進捗</TableHead>
              <TableHead className="text-[10px] p-1 w-[70px]">書類</TableHead>
              <TableHead className="text-[10px] p-1 min-w-[65px] w-[120px]">
                備考
              </TableHead>
              <TableHead className="text-[10px] p-1 sticky right-0 bg-background z-20 w-[50px]">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id} className="hover:bg-muted/50">
                {/* 管理組織 */}
                <TableCell className="text-[10px] p-1">
                  <OrganizationBadge
                    organization={
                      property.organization.name as OrganizationNameType
                    }
                  />
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
                <TableCell className="text-[10px] p-1 max-w-[100px]">
                  <PropertyNameCell propertyName={property.propertyName} />
                </TableCell>

                {/* 号室 */}
                <TableCell className="text-[10px] p-1 max-w-[100px]">
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
                  <ProgressStatusInlineEdit
                    propertyId={property.id}
                    currentStatus={property.progressStatus}
                  />
                </TableCell>

                {/* 書類（インライン編集） */}
                <TableCell className="text-[10px] p-1">
                  <DocumentStatusInlineEdit
                    propertyId={property.id}
                    currentStatus={property.documentStatus}
                  />
                </TableCell>

                {/* 備考（インライン編集） */}
                <TableCell className="text-[10px] p-1 max-w-[100px]">
                  <NotesPopoverEdit
                    propertyId={property.id}
                    currentNotes={property.notes}
                  />
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
      </PopoverProvider>
    </div>
  );
}
