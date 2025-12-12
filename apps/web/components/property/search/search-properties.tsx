"use client";

import { PropertyDetailModal } from "@/components/property/property-detail-modal";
import { columns } from "@/components/property/search/columns";
import { DataTable } from "@/components/property/search/data-table";
import type { PropertyWithRelations } from "@/lib/types/property";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";

interface SearchPropertiesProps {
  properties: PropertyWithRelations[];
}

export function SearchProperties({ properties }: SearchPropertiesProps) {
  const router = useRouter();
  const [, setPropertyId] = useQueryState("propertyId");

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
          data={properties}
          onView={handleViewDetails}
          onEdit={handlePropertyClick}
        />
      </div>

      {/* 編集モーダル */}
      <PropertyDetailModal />
    </div>
  );
}
