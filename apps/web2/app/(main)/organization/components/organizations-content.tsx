"use client";

import { OrganizationsList } from "@/app/(main)/organization/components/organizations-list";
import { useOrganizationsWithUserRole } from "@/lib/swr/organization";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function OrganizationsContent() {
  const { organizations, activeOrgId, isLoading, error } =
    useOrganizationsWithUserRole();

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-destructive text-center">
            組織の読み込みに失敗しました
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">読み込み中...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <OrganizationsList
      organizations={organizations || []}
      activeOrgId={activeOrgId || null}
    />
  );
}
