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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { MoreVertical, Eye, Edit } from "lucide-react";
import type { PropertyWithRelations } from "@/lib/types/property";
import { useRouter } from "next/navigation";
import { OrganizationNameType } from "@workspace/utils";
import ContractTypeBadge from "@/components/property/badge/contract-type-badge";
import CompanyBBadge from "@/components/property/badge/company-b-badge";
import BrokerCompanyBadge from "@/components/property/badge/broker-company-badge";
import OrganizationBadge from "@/components/property/badge/organization-badge";
import { ProgressStatusInlineEdit } from "@/components/property/inline-edit/progress-status-inline-edit";
import { DocumentStatusInlineEdit } from "@/components/property/inline-edit/document-status-inline-edit";
import { NotesPopoverEdit } from "@/components/property/inline-edit/notes-popover-edit";
import { SettlementDatePopoverEdit } from "@/components/property/inline-edit/settlement-date-popover-edit";
import { PropertyDetailModal } from "@/components/property/property-detail-modal";
import { useQueryState } from "nuqs";
import { PropertyNameCell } from "../property-name-cell";

interface SearchPropertiesTableProps {
  properties: PropertyWithRelations[];
  formatCurrency: (value: number | null | undefined) => string;
  formatDateWithDay: (dateString: string | Date | null) => string;
  truncateText: (text: string | null | undefined, maxLength?: number) => string;
}

export function SearchPropertiesTable({
  properties,
  formatCurrency,
  formatDateWithDay,
  truncateText,
}: SearchPropertiesTableProps) {
  const router = useRouter();
  const [, setPropertyId] = useQueryState("propertyId");

  const handlePropertyClick = (property: PropertyWithRelations) => {
    setPropertyId(property.id);
  };

  const handleViewDetails = (property: PropertyWithRelations) => {
    // 詳細画面へ遷移（決済日が必要なため、決済日がある場合のみ遷移可能）
    if (property.settlementDate) {
      const date = new Date(property.settlementDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      router.push(`/properties/monthly/${year}/${month}/${property.id}`);
    } else {
      // 決済日がない場合は編集モーダルを開く
      handlePropertyClick(property);
    }
  };

  return (
    <>
      <div className="overflow-auto max-h-[calc(100vh-250px)]">
        <Table className="text-[10px]">
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="text-[10px] p-1 sticky left-0 bg-background z-20 w-[70px]">
                  管理組織
                </TableHead>
                <TableHead className="text-[10px] p-1 sticky left-[70px] bg-background z-20 min-w-[45px] w-[70px]">
                  担当
                </TableHead>
                <TableHead className="text-[10px] p-1 sticky left-[140px] bg-background z-20 min-w-[65px]">
                  物件名
                </TableHead>
                <TableHead className="text-[10px] p-1 sticky left-[205px] bg-background z-20 w-[40px]">
                  号室
                </TableHead>
                <TableHead className="text-[10px] p-1 min-w-[55px]">
                  オーナー
                </TableHead>
                <TableHead className="text-[10px] p-1 w-[50px]">
                  A金額
                </TableHead>
                <TableHead className="text-[10px] p-1 w-[50px]">出口</TableHead>
                <TableHead className="text-[10px] p-1 w-[50px]">
                  仲手等
                </TableHead>
                <TableHead className="text-[10px] p-1 w-[50px]">利益</TableHead>
                <TableHead className="text-[10px] p-1 w-[50px]">
                  BC手付
                </TableHead>
                <TableHead className="text-[10px] p-1 w-[60px]">
                  決済日
                </TableHead>
                <TableHead className="text-[10px] p-1 min-w-[50px]">
                  買取
                </TableHead>
                <TableHead className="text-[10px] p-1 w-[70px]">
                  契約形態
                </TableHead>
                <TableHead className="text-[10px] p-1 w-[70px]">
                  B会社
                </TableHead>
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
                  <TableCell className="text-[10px] p-1 sticky left-0 bg-background">
                    <OrganizationBadge
                      organization={
                        property.organization.name as OrganizationNameType
                      }
                    />
                  </TableCell>
                  <TableCell className="text-[10px] p-1 sticky left-[70px] bg-background">
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
                  {/* 物件名 */}
                  <TableCell className="text-[10px] p-1 max-w-[100px]">
                    <PropertyNameCell propertyName={property.propertyName} />
                  </TableCell>
                  <TableCell className="text-[10px] p-1 sticky left-[205px] bg-background">
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
                    <SettlementDatePopoverEdit
                      propertyId={property.id}
                      currentDate={property.settlementDate}
                      formatDisplay={formatDateWithDay}
                    />
                  </TableCell>
                  <TableCell className="text-[10px] p-1">
                    <Badge variant="outline" className="text-[9px] px-1 py-0">
                      {truncateText(property.buyerCompany)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[10px] p-1">
                    <ContractTypeBadge contractType={property.contractType} />
                  </TableCell>
                  <TableCell className="text-[10px] p-1">
                    <CompanyBBadge companyB={property.companyB} />
                  </TableCell>
                  <TableCell className="text-[10px] p-1">
                    <BrokerCompanyBadge
                      brokerCompany={property.brokerCompany}
                    />
                  </TableCell>
                  <TableCell className="text-[10px] p-1">
                    <ProgressStatusInlineEdit
                      propertyId={property.id}
                      currentStatus={property.progressStatus}
                    />
                  </TableCell>
                  <TableCell className="text-[10px] p-1">
                    <DocumentStatusInlineEdit
                      propertyId={property.id}
                      currentStatus={property.documentStatus}
                    />
                  </TableCell>
                  <TableCell className="text-[10px] p-1">
                    <NotesPopoverEdit
                      propertyId={property.id}
                      currentNotes={property.notes}
                    />
                  </TableCell>
                  <TableCell className="text-[10px] p-1 sticky right-0 bg-background">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0"
                        >
                          <MoreVertical className="h-3 w-3" />
                          <span className="sr-only">操作メニュー</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(property)}
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

      {/* 編集モーダル */}
      <PropertyDetailModal />
    </>
  );
}
