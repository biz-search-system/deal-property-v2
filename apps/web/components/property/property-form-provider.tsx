"use client";

import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  propertyCreateSchema,
  type PropertyCreate,
} from "@workspace/drizzle/zod-schemas";
import { Form } from "@workspace/ui/components/form";
import { createProperty, updateProperty } from "@/lib/actions/property";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Property, ContractProgress } from "@workspace/drizzle/types";

interface PropertyFormProviderProps {
  children: React.ReactNode;
  defaultValues?: Partial<Property> & {
    staffIds?: string[];
    contractProgress?: ContractProgress | null;
  };
  mode: "create" | "edit";
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
      // 契約進捗 AB関係
      abContractSaved:
        defaultValues?.contractProgress?.abContractSaved ?? false,
      abAuthorizationSaved:
        defaultValues?.contractProgress?.abAuthorizationSaved ?? false,
      abSellerIdSaved:
        defaultValues?.contractProgress?.abSellerIdSaved ?? false,
    },
  });

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
