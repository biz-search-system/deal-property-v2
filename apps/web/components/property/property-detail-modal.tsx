"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Loader2 } from "lucide-react";
import { useQueryState } from "nuqs";
import PropertyFormProvider, {
  usePropertyForm,
} from "./property-form-provider";
import { PropertyProvider } from "./property-provider";
import { PropertyFormTabs } from "./property-form-tabs";
import {
  useOrganizations,
  useOrganizationsWithUserRole,
} from "@/lib/swr/organization";
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
  isValidating,
  onRequestClose,
}: {
  isValidating: boolean;
  onRequestClose: (isDirty: boolean) => void;
}) {
  const { formState } = usePropertyForm();
  const { isSubmitting, isDirty } = formState;

  const handleCancelClick = () => {
    onRequestClose(isDirty);
  };

  return (
    <div className="mt-6 flex shrink-0 items-center justify-end gap-3">
      {isValidating && (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      )}
      <Button
        type="button"
        variant="outline"
        onClick={handleCancelClick}
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

/** 離脱確認ダイアログのチェック用コンポーネント */
function UnsavedChangesChecker({
  onIsDirtyChange,
}: {
  onIsDirtyChange: (isDirty: boolean) => void;
}) {
  const { formState } = usePropertyForm();
  const { isDirty } = formState;

  // isDirtyが変更されたら親に通知
  useEffect(() => {
    onIsDirtyChange(isDirty);
  }, [isDirty, onIsDirtyChange]);

  return null;
}

export function PropertyDetailModal() {
  // URLのクエリパラメータからプロパティIDを取得
  const [propertyId, setPropertyId] = useQueryState("propertyId");

  // 離脱確認ダイアログの状態
  const [showUnsavedAlert, setShowUnsavedAlert] = useState(false);
  // フォームのisDirty状態を保持（Dialogのクローズ時に参照するため）
  const [formIsDirty, setFormIsDirty] = useState(false);

  // プロパティ詳細を取得
  const {
    property,
    isLoading: isLoadingProperty,
    isValidating: isValidatingProperty,
  } = usePropertyDetail(propertyId);

  // 組織一覧を取得
  // const { organizations, isLoading: isLoadingOrgs } =
  //   useOrganizationsWithUserRole();
  const { organizations, isLoading: isLoadingOrgs } = useOrganizations();

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

  // 閉じるリクエスト時のハンドラー（isDirtyをチェック）
  const handleRequestClose = (isDirty: boolean) => {
    if (isDirty) {
      setShowUnsavedAlert(true);
    } else {
      handleClose();
    }
  };

  // Dialogの外側クリックやEscキーでの閉じるリクエスト
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (formIsDirty) {
        setShowUnsavedAlert(true);
      } else {
        handleClose();
      }
    }
  };

  // 確認ダイアログで「閉じる」を選択
  const handleConfirmClose = () => {
    setShowUnsavedAlert(false);
    handleClose();
  };

  // 担当者のIDリストを取得
  const staffIds = property?.staff?.map((s) => s.userId) || [];

  const isLoading = isLoadingProperty || isLoadingOrgs || isLoadingMembers;
  const isOpen = propertyId !== null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
                <UnsavedChangesChecker onIsDirtyChange={setFormIsDirty} />
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                  <PropertyFormTabs
                    availableStaff={salesTeamMembers || []}
                    organizations={organizations || []}
                  />
                </div>

                <ModalFormActions
                  isValidating={isValidatingProperty}
                  onRequestClose={handleRequestClose}
                />
              </PropertyFormProvider>
            </PropertyProvider>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showUnsavedAlert} onOpenChange={setShowUnsavedAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>変更が保存されていません</AlertDialogTitle>
            <AlertDialogDescription>
              編集中の内容が保存されていません。保存せずに閉じると、変更内容は失われます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>編集を続ける</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>
              保存せずに閉じる
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
