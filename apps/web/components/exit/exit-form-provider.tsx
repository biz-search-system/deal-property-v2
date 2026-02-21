"use client";

import { useNavigationGuard } from "@/hooks/use-navigation-guard";
import type { Exit } from "@/lib/types/exit";
import { exitCreateSchema, type ExitCreate } from "@/lib/zod/schemas/exit";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@workspace/ui/components/form";
import { useRouter } from "next/navigation";
import { useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";

interface ExitFormProviderProps {
  children: React.ReactNode;
  defaultValues?: Partial<Exit>;
  mode: "create" | "edit";
  onSuccess?: () => void;
}

/** defaultValues をフォーム用の値に変換 */
function transformToFormValues(defaultValues?: Partial<Exit>): ExitCreate {
  return {
    propertyName: defaultValues?.propertyName || "",
    roomNumber: defaultValues?.roomNumber || null,
    address: defaultValues?.address || null,
    builtDate: defaultValues?.builtDate
      ? defaultValues.builtDate instanceof Date
        ? defaultValues.builtDate.toISOString().split("T")[0]
        : String(defaultValues.builtDate)
      : null,
    area: defaultValues?.area || null,
    structure: defaultValues?.structure || null,
    floor: defaultValues?.floor || null,
    situation: defaultValues?.situation || null,
    rent: defaultValues?.rent || null,
    managementFee: defaultValues?.managementFee || null,
    purchasePrice: defaultValues?.purchasePrice || null,
    maisokuPrice: defaultValues?.maisokuPrice || null,
    brokerageFee: defaultValues?.brokerageFee || null,
    expectedYield: defaultValues?.expectedYield || null,
    staffId: defaultValues?.staffId || null,
    notes: defaultValues?.notes || null,
    status: defaultValues?.status || "not_purchased",
  };
}

export function ExitFormProvider({
  children,
  defaultValues,
  mode,
  onSuccess,
}: ExitFormProviderProps) {
  const router = useRouter();
  const form = useForm<ExitCreate>({
    resolver: zodResolver(exitCreateSchema),
    defaultValues: transformToFormValues(defaultValues),
  });

  const isDirty = form.formState.isDirty;

  // 未保存変更がある場合の離脱防止
  useNavigationGuard(isDirty);

  const onSubmit = async (data: ExitCreate) => {
    try {
      if (mode === "create") {
        // TODO: createExit action を呼び出し、返却されたIDでマイソク作成画面に遷移する
        console.log("Create exit:", data);
        const exitId = "new"; // TODO: 実際のcreateExitの返却IDに差し替え
        toast.success("出口管理を作成しました");
        router.push(`/exits/${exitId}/maisoku`);
      } else {
        // TODO: updateExit action を呼び出す
        console.log("Update exit:", data);
        toast.success("出口管理を更新しました");
        onSuccess?.();
        router.refresh();
      }
    } catch (error) {
      const defaultMessage =
        mode === "create"
          ? "出口管理の作成に失敗しました"
          : "出口管理の更新に失敗しました";
      const message = error instanceof Error ? error.message : defaultMessage;
      toast.error(message);
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

export const useExitForm = () => useFormContext<ExitCreate>();
