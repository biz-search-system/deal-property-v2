"use client";

import { PropertyDetailModal } from "@/components/property/property-detail-modal";
import { columns } from "@/components/property/search/columns";
import { DataTable } from "@/components/property/search/data-table";
import type { PropertyWithRelations } from "@/lib/types/property";
import {
  ContractType,
  DocumentStatus,
  ProgressStatus,
} from "@workspace/drizzle/types";
import { OrganizationNameType } from "@workspace/utils";
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useMemo } from "react";

interface SearchPropertiesProps {
  properties: PropertyWithRelations[];
}

export function SearchProperties({ properties }: SearchPropertiesProps) {
  const router = useRouter();
  const [, setPropertyId] = useQueryState("propertyId");
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [organizationFilter, setOrganizationFilter] = useQueryState(
    "organization",
    { defaultValue: "" }
  );
  const [progressStatusFilter, setProgressStatusFilter] = useQueryState(
    "progressStatus",
    { defaultValue: "" }
  );
  const [documentStatusFilter, setDocumentStatusFilter] = useQueryState(
    "documentStatus",
    { defaultValue: "" }
  );
  const [contractTypeFilter, setContractTypeFilter] = useQueryState(
    "contractType",
    { defaultValue: "" }
  );

  // フィルタリング処理
  const filteredProperties = useMemo(() => {
    let result = properties;

    // 組織フィルター
    if (organizationFilter) {
      result = result.filter(
        (p) => p.organization?.name === organizationFilter
      );
    }

    // 進捗ステータスフィルター
    if (progressStatusFilter) {
      result = result.filter((p) => p.progressStatus === progressStatusFilter);
    }

    // 書類ステータスフィルター
    if (documentStatusFilter) {
      result = result.filter((p) => p.documentStatus === documentStatusFilter);
    }

    // 契約形態フィルター
    if (contractTypeFilter) {
      result = result.filter((p) => p.contractType === contractTypeFilter);
    }

    // fuse.jsでファジー検索
    if (search) {
      const fuse = new Fuse(result, {
        keys: ["propertyName", "ownerName", "roomNumber", "notes"],
        threshold: 0.3,
        ignoreLocation: true,
      });
      result = fuse.search(search).map((r) => r.item);
    }

    return result;
  }, [
    properties,
    search,
    organizationFilter,
    progressStatusFilter,
    documentStatusFilter,
    contractTypeFilter,
  ]);

  const handlePropertyClick = (property: PropertyWithRelations) => {
    setPropertyId(property.id);
  };

  const handleViewDetails = (property: PropertyWithRelations) => {
    router.push(`/properties/search/${property.id}`);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-1 flex-col gap-3 overflow-hidden p-4 lg:p-3">
        <DataTable
          columns={columns}
          data={filteredProperties}
          onView={handleViewDetails}
          onEdit={handlePropertyClick}
          search={search}
          onSearchChange={setSearch}
          organizationFilter={
            (organizationFilter as OrganizationNameType) || undefined
          }
          onOrganizationFilterChange={setOrganizationFilter}
          progressStatusFilter={
            (progressStatusFilter as ProgressStatus) || undefined
          }
          onProgressStatusFilterChange={setProgressStatusFilter}
          documentStatusFilter={
            (documentStatusFilter as DocumentStatus) || undefined
          }
          onDocumentStatusFilterChange={setDocumentStatusFilter}
          contractTypeFilter={(contractTypeFilter as ContractType) || undefined}
          onContractTypeFilterChange={setContractTypeFilter}
        />
      </div>

      {/* 編集モーダル */}
      <PropertyDetailModal />
    </div>
  );
}
