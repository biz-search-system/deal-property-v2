"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { OrganizationWithUserRole } from "@/lib/types/organization";
import { OrganizationCardMenu } from "./organization-card-menu";

interface OrganizationsListProps {
  organizations: OrganizationWithUserRole[];
  activeOrgId: string | null;
}

export function OrganizationsList({
  organizations,
  activeOrgId,
}: OrganizationsListProps) {
  const isDev = process.env.NODE_ENV !== "production";
  if (organizations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-center mb-4">
            まだ組織に参加していません
          </p>
          <p className="text-sm text-muted-foreground text-center">
            新しい組織を作成するか、招待を受けてください
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => {
          const userRole = org.userRole;
          const isOwner = userRole === "owner";
          const isActive = org.id === activeOrgId;

          return (
            <Link href={`/organization/${org.id}`} key={org.id}>
              <Card
                className={`${isDev && isActive ? "ring-2 ring-primary" : ""} cursor-pointer hover:shadow-lg transition-shadow`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{org.name}</CardTitle>
                      <CardDescription className="font-mono text-xs">
                        組織ID：{org.id}
                      </CardDescription>
                    </div>
                    <OrganizationCardMenu
                      organizationId={org.id}
                      organizationName={org.name}
                      isActive={isDev ? isActive : undefined}
                      isOwner={isOwner}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {org.metadata?.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {org.metadata.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {org.memberCount} メンバー
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isDev && isActive && (
                        <Badge variant="default" className="text-xs">
                          アクティブ
                        </Badge>
                      )}
                      {userRole && (
                        <Badge variant="outline" className="text-xs">
                          {userRole === "owner"
                            ? "オーナー"
                            : userRole === "admin"
                              ? "管理者"
                              : "メンバー"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}
