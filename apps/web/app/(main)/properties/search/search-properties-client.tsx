"use client";

import { PropertyDetailModal } from "@/components/property/property-detail-modal";
import { columns } from "@/components/property/search/columns";
import { DataTable } from "@/components/property/search/data-table";
import type { PropertyWithRelations } from "@/lib/types/property";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchPropertiesClientProps {
  properties: PropertyWithRelations[];
}

export function SearchPropertiesClient({
  properties,
}: SearchPropertiesClientProps) {
  const router = useRouter();
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyWithRelations | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePropertyClick = (property: PropertyWithRelations) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
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
      <PropertyDetailModal
        property={selectedProperty}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
