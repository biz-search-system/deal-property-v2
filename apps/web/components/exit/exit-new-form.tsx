"use client";

import { Button } from "@workspace/ui/components/button";
import { ExitFormProvider, useExitForm } from "./exit-form-provider";
import { ExitFormFields } from "./form/exit-form-fields";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

function FormContent() {
  const form = useExitForm();
  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-1 flex-col gap-4 overflow-auto p-4 lg:p-6">
        <ExitFormFields />
      </div>

      {/* フッター */}
      <div className="flex items-center justify-between border-t bg-background px-4 py-3 lg:px-6">
        <Button variant="outline" asChild>
          <Link href="/exits">
            <ArrowLeft className="size-4" />
            戻る
          </Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : "マイソク作成へ進む"}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function ExitNewForm() {
  return (
    <ExitFormProvider mode="create">
      <FormContent />
    </ExitFormProvider>
  );
}
