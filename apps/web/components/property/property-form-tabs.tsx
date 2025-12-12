"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import BasicInfoTab from "./tabs/basic-info-tab";
import ContractProgressTab from "./tabs/contract-progress-tab";
import DocumentProgressTab from "./tabs/document-progress-tab";
import SettlementProgressTab from "./tabs/settlement-progress-tab";
import type { Organization } from "@/lib/types/organization";

interface PropertyFormTabsProps {
  availableStaff: { id: string; name: string; email: string; role: string }[];
  organizations?: Organization[];
  defaultTab?: string;
}

export function PropertyFormTabs({
  availableStaff,
  organizations = [],
  defaultTab = "basic",
}: PropertyFormTabsProps) {
  return (
    <Tabs defaultValue={defaultTab} className="flex min-h-0 flex-1 flex-col">
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
