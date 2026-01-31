"use client";

import { Button } from "@workspace/ui/components/button";
import { BrokerFormProvider, useBrokerForm } from "./broker-form-provider";
import { BrokerFormFields } from "./broker-form-fields";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function FormContent() {
  const form = useBrokerForm();
  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-1 flex-col gap-4 overflow-auto p-4 lg:p-6">
        <BrokerFormFields />
      </div>

      {/* フッター */}
      <div className="flex items-center justify-between border-t bg-background px-4 py-3 lg:px-6">
        <Button variant="outline" asChild>
          <Link href="/brokers">
            <ArrowLeft className="size-4" />
            戻る
          </Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : "保存"}
        </Button>
      </div>
    </div>
  );
}

export function BrokerNewForm() {
  return (
    <BrokerFormProvider mode="create">
      <FormContent />
    </BrokerFormProvider>
  );
}
