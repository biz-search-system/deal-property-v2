"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronsUpDown, Plus } from "lucide-react";
import { useOrganizationName } from "@/lib/swr/organization";
import { useSession } from "@/lib/swr/session";
import { AppConfig } from "@/app.config";

interface BreadcrumbItemType {
  label: string;
  href: string;
  isActive: boolean;
  organizationId?: string;
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useSession();
  const isSystemOwner = AppConfig.systemOwnerIds.includes(user?.id || "");

  // パスから組織IDを抽出
  const paths = pathname.split("/").filter((path) => path);
  const organizationIndex = paths.indexOf("organization");
  const organizationId =
    organizationIndex !== -1 && paths[organizationIndex + 1]
      ? paths[organizationIndex + 1]
      : null;

  // 組織情報を取得
  const { organization } = useOrganizationName(organizationId);

  // 年の選択肢を生成（現在年の前後2年）
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // 月の選択肢
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // パスからパンくずリストを生成
  const getBreadcrumbs = (): BreadcrumbItemType[] => {
    const paths = pathname.split("/").filter((path) => path);
    const breadcrumbs: BreadcrumbItemType[] = [];

    // パスを解析してパンくずを生成
    let href = "";
    paths.forEach((path, index) => {
      href += `/${path}`;

      // パス名を日本語に変換
      let label = path;
      let isOrganizationId = false;

      switch (path) {
        case "properties":
          label = "案件管理";
          break;
        case "unconfirmed":
          label = "業者確定前";
          break;
        case "monthly":
          label = "月別案件";
          break;
        case "organization":
          label = "組織管理";
          break;
        case "settings":
          label = "設定";
          break;
        default:
          // 年（4桁の数字）の場合
          if (/^\d{4}$/.test(path)) {
            label = `${path}年`;
          }
          // 月（2桁の数字）の場合
          else if (
            /^\d{2}$/.test(path) &&
            paths[index - 1] &&
            /^\d{4}$/.test(paths[index - 1])
          ) {
            label = `${parseInt(path)}月`;
          }
          // 組織IDの場合
          else if (paths[index - 1] === "organization" && path !== "new") {
            isOrganizationId = true;
            label = organization?.name || path;
          }
          // IDっぽい場合（その他の数字）
          else if (/^\d+$/.test(path)) {
            label = "詳細";
          }
          break;
      }

      breadcrumbs.push({
        label,
        href,
        isActive: index === paths.length - 1,
        ...(isOrganizationId && { organizationId: path }),
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // パンくずは1階層以上で表示
  const shouldShowBreadcrumbs = breadcrumbs.length >= 1;

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* パンくずリスト */}
        {shouldShowBreadcrumbs && (
          <div className="ml-4 flex-1">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => {
                  // /properties と /properties/monthly はページが存在しないのでリンク不可
                  const isNonLinkable =
                    breadcrumb.href === "/properties" ||
                    breadcrumb.href === "/properties/monthly";

                  // 年の判定（4桁の数字）
                  const isYear = /^\d{4}$/.test(
                    breadcrumb.label.replace("年", "")
                  );
                  // 月の判定（数字 + "月"）
                  const isMonth = /^\d{1,2}月$/.test(breadcrumb.label);

                  // 現在のパスから年と月を取得
                  const paths = pathname.split("/").filter((p) => p);
                  const currentYear = paths.find((p) => /^\d{4}$/.test(p));
                  const currentMonth = paths.find(
                    (p, i) =>
                      /^\d{2}$/.test(p) &&
                      paths[i - 1] &&
                      /^\d{4}$/.test(paths[i - 1])
                  );

                  // 月別案件のベースパス
                  const monthlyBasePath = "/properties/monthly";

                  return (
                    <BreadcrumbItem key={breadcrumb.href}>
                      {isYear || isMonth ? (
                        <>
                          <div className="flex items-center gap-1">
                            <span className="text-foreground">
                              {breadcrumb.label}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto w-auto p-0 hover:bg-accent"
                                >
                                  <ChevronsUpDown className="size-4 opacity-50" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuRadioGroup
                                  value={isYear ? currentYear : currentMonth}
                                  onValueChange={(value) => {
                                    if (isYear) {
                                      router.push(
                                        `${monthlyBasePath}/${value}/${currentMonth || "01"}`
                                      );
                                    } else {
                                      router.push(
                                        `${monthlyBasePath}/${currentYear}/${value}`
                                      );
                                    }
                                  }}
                                >
                                  {isYear
                                    ? years.map((year) => (
                                        <DropdownMenuRadioItem
                                          key={year}
                                          value={String(year)}
                                        >
                                          {year}年
                                        </DropdownMenuRadioItem>
                                      ))
                                    : months.map((month) => (
                                        <DropdownMenuRadioItem
                                          key={month}
                                          value={String(month).padStart(2, "0")}
                                        >
                                          {month}月
                                        </DropdownMenuRadioItem>
                                      ))}
                                </DropdownMenuRadioGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          {index < breadcrumbs.length - 1 && (
                            <BreadcrumbSeparator />
                          )}
                        </>
                      ) : breadcrumb.isActive ? (
                        <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                      ) : isNonLinkable ? (
                        <>
                          <span
                            className={
                              breadcrumb.href === "/properties/monthly"
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }
                          >
                            {breadcrumb.label}
                          </span>
                          {index < breadcrumbs.length - 1 && (
                            <BreadcrumbSeparator />
                          )}
                        </>
                      ) : (
                        <>
                          <BreadcrumbLink asChild>
                            <Link href={breadcrumb.href}>
                              {breadcrumb.label}
                            </Link>
                          </BreadcrumbLink>
                          {index < breadcrumbs.length - 1 && (
                            <BreadcrumbSeparator />
                          )}
                        </>
                      )}
                    </BreadcrumbItem>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}

        {pathname === "/properties/unconfirmed" && (
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" asChild>
              <Link href="/properties/new">
                <Plus />
                新規案件登録
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
