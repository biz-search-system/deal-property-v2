"use client";

import { Separator } from "@workspace/ui/components/separator";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Button } from "@workspace/ui/components/button";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Eye, Plus } from "lucide-react";
import { useSession } from "@/lib/swr/session";
import { AppConfig } from "@/app.config";
import { BreadcrumbMain } from "../breadcrumb-provider";

export function SiteHeader({ systemOwnerIds }: { systemOwnerIds?: string[] }) {
  const pathname = usePathname();
  const params = useParams();
  const propertyId = params?.id as string | undefined;
  const { user } = useSession();
  const isSystemOwner = systemOwnerIds?.includes(user?.id || "");

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* パンくずリスト（BreadcrumbConfigで設定された場合のみ表示） */}
        <BreadcrumbMain homeHref="/properties/unconfirmed" />

        {pathname === `/properties/unconfirmed` && (
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" asChild>
              <Link href="/properties/new">
                <Plus />
                新規案件登録
              </Link>
            </Button>
          </div>
        )}
        {pathname === `/properties/unconfirmed/${propertyId}` && (
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" asChild>
              <Link href={`/properties/unconfirmed/${propertyId}/edit`}>
                <Edit />
                編集
              </Link>
            </Button>
          </div>
        )}
        {pathname === `/properties/unconfirmed/${propertyId}/edit` && (
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="gap-2">
              <Link href={`/properties/unconfirmed/${propertyId}`}>
                <Eye />
                詳細
              </Link>
            </Button>
          </div>
        )}

        {pathname === "/organization" && isSystemOwner && (
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" asChild>
              <Link href="/organization/new">
                <Plus />
                新しい組織を作成
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
