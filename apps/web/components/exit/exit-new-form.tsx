"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ExitFormProvider, useExitForm } from "./exit-form-provider";
import {
  PropertyNameField,
  RoomNumberField,
  AddressField,
  BuiltDateField,
  AreaField,
  StructureField,
  FloorField,
  SituationField,
  RentField,
  ManagementFeeField,
  PurchasePriceField,
  MaisokuPriceField,
  ExpectedYieldField,
  StatusField,
  NotesField,
} from "./form/exit-form-fields";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function FormContent() {
  const form = useExitForm();
  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-1 flex-col gap-4 overflow-auto p-4 lg:p-6">
        {/* 物件情報 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">物件情報</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PropertyNameField />
            <RoomNumberField />
            <AddressField />
            <BuiltDateField />
            <AreaField />
            <StructureField />
            <FloorField />
          </CardContent>
        </Card>

        {/* 現況情報 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">現況情報</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SituationField />
            <RentField />
            <ManagementFeeField />
          </CardContent>
        </Card>

        {/* 金額情報 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">金額情報</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PurchasePriceField />
            <MaisokuPriceField />
            <ExpectedYieldField />
          </CardContent>
        </Card>

        {/* ステータス・備考 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">ステータス・備考</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <StatusField />
            <NotesField />
          </CardContent>
        </Card>
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
          {isSubmitting ? "保存中..." : "保存"}
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
