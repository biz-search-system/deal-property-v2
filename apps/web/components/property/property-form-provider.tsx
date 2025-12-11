"use client";

import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  propertyCreateSchema,
  type PropertyCreate,
} from "@workspace/drizzle/zod-schemas";
import { Form } from "@workspace/ui/components/form";
import { createProperty, updateProperty } from "@/lib/actions/property";
import { useNavigationGuard } from "@/hooks/use-navigation-guard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type {
  Property,
  ContractProgress,
  PropertyDocumentItem,
} from "@workspace/drizzle/types";

interface PropertyFormProviderProps {
  children: React.ReactNode;
  defaultValues?: Partial<Property> & {
    staffIds?: string[];
    contractProgress?: ContractProgress | null;
    documentItems?: PropertyDocumentItem[];
  };
  mode: "create" | "edit";
}

/** 書類項目配列からitemTypeでステータスを取得するヘルパー */
function getDocumentItemStatus(
  items: PropertyDocumentItem[] | undefined,
  itemType: string
): string {
  return items?.find((item) => item.itemType === itemType)?.status || "not_requested";
}

export default function PropertyFormProvider({
  children,
  defaultValues,
  mode,
}: PropertyFormProviderProps) {
  const router = useRouter();

  const form = useForm<PropertyCreate>({
    resolver: zodResolver(propertyCreateSchema),
    defaultValues: {
      organizationId: defaultValues?.organizationId || "",
      propertyName: defaultValues?.propertyName || "",
      roomNumber: defaultValues?.roomNumber || "",
      ownerName: defaultValues?.ownerName || "",
      amountA: defaultValues?.amountA || undefined,
      amountExit: defaultValues?.amountExit || undefined,
      commission: defaultValues?.commission || undefined,
      bcDeposit: defaultValues?.bcDeposit || undefined,
      contractDateA: defaultValues?.contractDateA
        ? defaultValues.contractDateA instanceof Date
          ? defaultValues.contractDateA.toISOString().split("T")[0]
          : defaultValues.contractDateA
        : "",
      contractDateBc: defaultValues?.contractDateBc
        ? defaultValues.contractDateBc instanceof Date
          ? defaultValues.contractDateBc.toISOString().split("T")[0]
          : defaultValues.contractDateBc
        : "",
      settlementDate: defaultValues?.settlementDate
        ? defaultValues.settlementDate instanceof Date
          ? defaultValues.settlementDate.toISOString().split("T")[0]
          : defaultValues.settlementDate
        : "",
      contractType: defaultValues?.contractType || "",
      companyB: defaultValues?.companyB || "",
      brokerCompany: defaultValues?.brokerCompany || "",
      buyerCompany: defaultValues?.buyerCompany || "",
      mortgageBank: defaultValues?.mortgageBank || "",
      listType: defaultValues?.listType || "",
      notes: defaultValues?.notes || "",
      progressStatus: defaultValues?.progressStatus || "bc_before_confirmed", // DBデフォルト値
      documentStatus: defaultValues?.documentStatus || "waiting_request", // DBデフォルト値
      accountCompany: defaultValues?.accountCompany || "",
      bankAccount: defaultValues?.bankAccount || "",
      staffIds: defaultValues?.staffIds || [],
      // 契約進捗 マイソク配布
      maisokuDistribution:
        defaultValues?.contractProgress?.maisokuDistribution || "not_distributed",
      // 契約進捗 AB関係
      abContractSaved:
        defaultValues?.contractProgress?.abContractSaved ?? false,
      abAuthorizationSaved:
        defaultValues?.contractProgress?.abAuthorizationSaved ?? false,
      abSellerIdSaved:
        defaultValues?.contractProgress?.abSellerIdSaved ?? false,
      // 契約進捗 BC関係
      bcContractCreated:
        defaultValues?.contractProgress?.bcContractCreated ?? false,
      bcDescriptionCreated:
        defaultValues?.contractProgress?.bcDescriptionCreated ?? false,
      bcContractSent: defaultValues?.contractProgress?.bcContractSent ?? false,
      bcDescriptionSent:
        defaultValues?.contractProgress?.bcDescriptionSent ?? false,
      bcContractCbDone:
        defaultValues?.contractProgress?.bcContractCbDone ?? false,
      bcDescriptionCbDone:
        defaultValues?.contractProgress?.bcDescriptionCbDone ?? false,

      // 書類項目（銀行関係）
      documentItem_loan_calculation: getDocumentItemStatus(
        defaultValues?.documentItems,
        "loan_calculation"
      ),

      // 書類項目（賃貸管理関係）
      documentItem_rental_contract: getDocumentItemStatus(
        defaultValues?.documentItems,
        "rental_contract"
      ),
      documentItem_management_contract: getDocumentItemStatus(
        defaultValues?.documentItems,
        "management_contract"
      ),
      documentItem_move_in_application: getDocumentItemStatus(
        defaultValues?.documentItems,
        "move_in_application"
      ),

      // 書類項目（建物管理関係）
      documentItem_important_matters_report: getDocumentItemStatus(
        defaultValues?.documentItems,
        "important_matters_report"
      ),
      documentItem_management_rules: getDocumentItemStatus(
        defaultValues?.documentItems,
        "management_rules"
      ),
      documentItem_long_term_repair_plan: getDocumentItemStatus(
        defaultValues?.documentItems,
        "long_term_repair_plan"
      ),
      documentItem_general_meeting_minutes: getDocumentItemStatus(
        defaultValues?.documentItems,
        "general_meeting_minutes"
      ),
      documentItem_pamphlet: getDocumentItemStatus(
        defaultValues?.documentItems,
        "pamphlet"
      ),
      documentItem_bank_transfer_form: getDocumentItemStatus(
        defaultValues?.documentItems,
        "bank_transfer_form"
      ),
      documentItem_owner_change_notification: getDocumentItemStatus(
        defaultValues?.documentItems,
        "owner_change_notification"
      ),

      // 書類項目（役所関係）
      documentItem_tax_certificate: getDocumentItemStatus(
        defaultValues?.documentItems,
        "tax_certificate"
      ),
      documentItem_building_plan_overview: getDocumentItemStatus(
        defaultValues?.documentItems,
        "building_plan_overview"
      ),
      documentItem_ledger_certificate: getDocumentItemStatus(
        defaultValues?.documentItems,
        "ledger_certificate"
      ),
      documentItem_zoning_district: getDocumentItemStatus(
        defaultValues?.documentItems,
        "zoning_district"
      ),
      documentItem_road_ledger: getDocumentItemStatus(
        defaultValues?.documentItems,
        "road_ledger"
      ),
    },
  });

  // 未保存変更がある場合の離脱防止
  useNavigationGuard(form.formState.isDirty);

  const onSubmit = async (data: PropertyCreate) => {
    try {
      if (mode === "create") {
        await createProperty(data);
        toast.success("案件を作成しました");
        router.push("/properties/unconfirmed");
      } else {
        if (!defaultValues?.id) {
          toast.error("案件IDが見つかりません");
          return;
        }
        await updateProperty({ ...data, id: defaultValues.id });
        toast.success("案件を更新しました");
        // router.push("/properties/unconfirmed");
      }
    } catch (error) {
      toast.error(
        mode === "create"
          ? "案件の作成に失敗しました"
          : "案件の更新に失敗しました"
      );
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex min-h-0 flex-1 flex-col"
      >
        {children}
      </form>
    </Form>
  );
}

export const usePropertyForm = () => useFormContext<PropertyCreate>();
