"use client";

import type { Organization } from "@/lib/types/organization";
import type { SalesTeamMember } from "@/lib/types/team";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { cn } from "@workspace/utils";
import { useQueryState } from "nuqs";
import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { getFirstErrorTab } from "./form-tab-mapping";
import BasicInfoTab from "./tabs/basic-info-tab";
import ContractProgressTab from "./tabs/contract-progress-tab";
import DocumentProgressTab from "./tabs/document-progress-tab";
import SettlementProgressTab from "./tabs/settlement-progress-tab";

const TAB_VALUES = ["basic", "contract", "document", "settlement"] as const;
type TabValue = (typeof TAB_VALUES)[number];

interface PropertyFormTabsProps {
  availableStaff: SalesTeamMember[];
  organizations?: Organization[];
  defaultTab?: TabValue;
  className?: string;
}

export function PropertyFormTabs({
  availableStaff,
  organizations = [],
  defaultTab = "basic",
  className,
}: PropertyFormTabsProps) {
  const [tab, setTab] = useQueryState("formTab", {
    defaultValue: defaultTab,
    shallow: false,
  });

  // フォームのエラー状態を取得
  const {
    formState: { errors, submitCount },
  } = useFormContext();

  // 前回のsubmitCountとエラーフィールドを追跡
  const prevSubmitCountRef = useRef(submitCount);
  const prevErrorFieldsRef = useRef<string[]>([]);

  // フォーム送信時またはサーバーエラー時にエラータブに切り替え
  useEffect(() => {
    const errorFields = Object.keys(errors);

    // submitCountが増加した場合（クライアントバリデーションエラー）
    // または新しいエラーフィールドが追加された場合（サーバーバリデーションエラー）
    const isNewSubmit = submitCount > prevSubmitCountRef.current;
    const hasNewErrors = errorFields.some(
      (field) => !prevErrorFieldsRef.current.includes(field)
    );

    if ((isNewSubmit || hasNewErrors) && errorFields.length > 0) {
      prevSubmitCountRef.current = submitCount;
      prevErrorFieldsRef.current = errorFields;

      const errorTab = getFirstErrorTab(errorFields);
      if (errorTab && errorTab !== tab) {
        setTab(errorTab);
      }
    } else {
      // エラーがクリアされた場合は追跡を更新
      prevErrorFieldsRef.current = errorFields;
    }
  }, [submitCount, errors, tab, setTab]);

  // 無効なタブ値の場合はデフォルトにフォールバック
  const currentTab = TAB_VALUES.includes(tab as TabValue)
    ? (tab as TabValue)
    : defaultTab;

  return (
    <Tabs
      value={currentTab}
      onValueChange={setTab}
      className={cn("flex min-h-0 flex-1 flex-col", className)}
    >
      <TabsList className="grid w-full shrink-0 grid-cols-4">
        <TabsTrigger value="basic">基本情報</TabsTrigger>
        <TabsTrigger value="contract">契約進捗</TabsTrigger>
        <TabsTrigger value="document">書類進捗</TabsTrigger>
        <TabsTrigger value="settlement">決済進捗</TabsTrigger>
      </TabsList>

      <div className="min-h-0 flex-1 overflow-auto">
        <TabsContent value="basic" className="mt-3 px-1">
          <BasicInfoTab
            availableStaff={availableStaff}
            organizations={organizations}
          />
        </TabsContent>

        <TabsContent value="contract" className="mt-2 px-1">
          <ContractProgressTab />
        </TabsContent>

        <TabsContent value="document" className="mt-3 px-1">
          <DocumentProgressTab />
        </TabsContent>

        <TabsContent value="settlement" className="mt-3 px-1">
          <SettlementProgressTab />
        </TabsContent>
      </div>
    </Tabs>
  );
}
