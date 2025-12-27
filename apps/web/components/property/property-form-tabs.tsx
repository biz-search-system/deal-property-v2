"use client";

import type { Organization } from "@/lib/types/organization";
import type { SalesTeamMember } from "@/lib/types/team";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { useQueryState } from "nuqs";
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
}

export function PropertyFormTabs({
  availableStaff,
  organizations = [],
  defaultTab = "basic",
}: PropertyFormTabsProps) {
  const [tab, setTab] = useQueryState("formTab", {
    defaultValue: defaultTab,
    shallow: false,
  });

  // 無効なタブ値の場合はデフォルトにフォールバック
  const currentTab = TAB_VALUES.includes(tab as TabValue)
    ? (tab as TabValue)
    : defaultTab;

  return (
    <Tabs
      value={currentTab}
      onValueChange={setTab}
      className="flex min-h-0 flex-1 flex-col"
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
