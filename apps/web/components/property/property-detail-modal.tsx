"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Loader2 } from "lucide-react";
import { useQueryState } from "nuqs";
import PropertyFormProvider, {
  usePropertyForm,
} from "./property-form-provider";
import { PropertyProvider } from "./property-provider";
import { PropertyFormTabs } from "./property-form-tabs";
import { useOrganizationsWithUserRole } from "@/lib/swr/organization";
import { useSalesTeamMembers } from "@/lib/swr/team";
import { usePropertyDetail } from "@/lib/swr/property";
import {
  cn,
  PROGRESS_STATUS_COLORS,
  PROGRESS_STATUS_LABELS,
  DOCUMENT_STATUS_COLORS,
  DOCUMENT_STATUS_LABELS,
} from "@workspace/utils";

/** モーダルフッターのボタン（フォームコンテキスト内で使用） */
function ModalFormActions({
  onClose,
  isValidating,
}: {
  onClose: () => void;
  isValidating: boolean;
}) {
  const { formState } = usePropertyForm();
  const { isSubmitting } = formState;

  return (
    <div className="mt-6 flex shrink-0 items-center justify-end gap-3">
      {isValidating && (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      )}
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        disabled={isSubmitting}
      >
        キャンセル
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "保存中..." : "保存"}
      </Button>
    </div>
  );
}

export function PropertyDetailModal() {
  // URLのクエリパラメータからプロパティIDを取得
  const [propertyId, setPropertyId] = useQueryState("propertyId");

  // プロパティ詳細を取得
  const {
    property,
    isLoading: isLoadingProperty,
    mutate: mutateProperty,
    isValidating: isValidatingProperty,
  } = usePropertyDetail(propertyId);

  // 組織一覧を取得
  const { organizations, isLoading: isLoadingOrgs } =
    useOrganizationsWithUserRole();

  // 営業チームメンバーを取得
  const { members: salesTeamMembers, isLoading: isLoadingMembers } =
    useSalesTeamMembers(property?.organizationId ?? null);

  // ダイアログを閉じる
  const handleClose = () => {
    setPropertyId(null);
  };
  const handleSuccess = () => {
    setPropertyId(null);
  };

  // 担当者のIDリストを取得
  const staffIds = property?.staff?.map((s) => s.userId) || [];

  const isLoading = isLoadingProperty || isLoadingOrgs || isLoadingMembers;
  const isOpen = propertyId !== null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="flex h-[92vh] w-full max-w-[95vw] md:max-w-4xl lg:max-w-7xl flex-col overflow-hidden p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {isLoading || !property ? (
              <span className="text-xl">読み込み中...</span>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div>
                  <span className="text-xl">{property.propertyName}</span>
                </div>
                <div className="flex items-center gap-2 pr-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      PROGRESS_STATUS_COLORS[property.progressStatus]
                    )}
                  >
                    {property.progressStatus
                      ? PROGRESS_STATUS_LABELS[property.progressStatus]
                      : "-"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      DOCUMENT_STATUS_COLORS[property.documentStatus]
                    )}
                  >
                    {property.documentStatus
                      ? DOCUMENT_STATUS_LABELS[property.documentStatus]
                      : "-"}
                  </Badge>
                </div>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading || !property ? (
          <div className="flex flex-1 items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <PropertyProvider property={property}>
            <PropertyFormProvider
              mode="edit"
              onSuccess={handleSuccess}
              defaultValues={{
                ...property,
                staffIds,
                contractProgress: property.contractProgress ?? null,
                documentItems: property.documentItems ?? [],
                settlementProgress: property.settlementProgress ?? null,
              }}
              isValidating={isValidatingProperty}
            >
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <PropertyFormTabs
                  availableStaff={salesTeamMembers || []}
                  organizations={organizations || []}
                />
              </div>

              <ModalFormActions
                onClose={handleClose}
                isValidating={isValidatingProperty}
              />
            </PropertyFormProvider>
          </PropertyProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}
