"use client";

import { OrganizationsList } from "@/components/organizations/organizations-list";
import {
  useOrganizations,
  useOrganizationsWithUserRole,
} from "@/lib/swr/organization";
import { authClient } from "@workspace/auth/client";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Loader2 } from "lucide-react";

export function OrganizationsContent() {
  const { organizations, activeOrgId, isLoading, isValidating, error } =
    useOrganizationsWithUserRole();
  // const { organizations, isLoading, isValidating, error } = useOrganizations();
  // const sesstion = authClient.useSession();
  // const activeOrgId = sesstion.data?.session?.activeOrganizationId;

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

  if (isLoading || isValidating) {
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
