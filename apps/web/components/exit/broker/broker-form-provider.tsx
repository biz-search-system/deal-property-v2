"use client";

import { useNavigationGuard } from "@/hooks/use-navigation-guard";
import {
  brokerCreateSchema,
  type BrokerCreate,
} from "@/lib/zod/schemas/broker";
import type { Broker } from "@/lib/types/broker";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@workspace/ui/components/form";
import { useRouter } from "next/navigation";
import { useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";

function transformToFormValues(defaultValues?: Partial<Broker>): BrokerCreate {
  return {
    name: defaultValues?.name || "",
    brokerType: defaultValues?.brokerType || "buyer",
    contactName: defaultValues?.contactName || null,
    email: defaultValues?.email || "",
    phone: defaultValues?.phone || null,
    address: defaultValues?.address || null,
    startedAt: defaultValues?.startedAt
      ? defaultValues.startedAt.toISOString().split("T")[0]
      : null,
    groupId: defaultValues?.groupId || null,
    notes: defaultValues?.notes || null,
    isActive: defaultValues?.isActive ?? true,
    displayOrder: defaultValues?.displayOrder || null,
  };
}

interface BrokerFormProviderProps {
  children: React.ReactNode;
  defaultValues?: Partial<Broker>;
  mode: "create" | "edit";
  onSuccess?: () => void;
}

export function BrokerFormProvider({
  children,
  defaultValues,
  mode,
  onSuccess,
}: BrokerFormProviderProps) {
  const router = useRouter();
  const form = useForm<BrokerCreate>({
    resolver: zodResolver(brokerCreateSchema),
    defaultValues: transformToFormValues(defaultValues),
  });

  const isDirty = form.formState.isDirty;
  useNavigationGuard(isDirty);

  const onSubmit = async (data: BrokerCreate) => {
    try {
      if (mode === "create") {
        // TODO: 実際のServer Actionに置き換え
        console.log("Create broker:", data);
        toast.success("業者を登録しました");
        router.push("/brokers");
      } else {
        // TODO: 実際のServer Actionに置き換え
        console.log("Update broker:", data);
        toast.success("業者を更新しました");
        onSuccess?.();
        router.refresh();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "処理に失敗しました");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
    </Form>
  );
}

export const useBrokerForm = () => useFormContext<BrokerCreate>();
