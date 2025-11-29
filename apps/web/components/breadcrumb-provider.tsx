"use client";

import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { createContext, use, useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Home, SlashIcon } from "lucide-react";

export type BreadCrumbItem = {
  label: string;
  href?: string;
  /** カスタムレンダラー（年・月セレクトなど） */
  render?: () => ReactNode;
};

const BreadcrumbContext = createContext<{
  breadcrumbs: BreadCrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadCrumbItem[]) => void;
}>({
  breadcrumbs: [],
  setBreadcrumbs: () => {},
});

export function BreadcrumbProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadCrumbItem[]>([]);
  return (
    <BreadcrumbContext value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext>
  );
}

export function BreadcrumbConfig({ items }: { items: BreadCrumbItem[] }) {
  const { setBreadcrumbs } = use(BreadcrumbContext);

  useEffect(() => {
    setBreadcrumbs(items);

    return () => {
      setBreadcrumbs([]);
    };
  }, [items, setBreadcrumbs]);

  return null;
}

export function BreadcrumbMain({ homeHref = "/" }: { homeHref?: string }) {
  const { breadcrumbs } = use(BreadcrumbContext);

  // パンくずが設定されていない場合は何も表示しない
  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className="flex-1">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={homeHref}>
              <Home className="size-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((breadcrumb) => (
          <Fragment key={breadcrumb.label}>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {breadcrumb.render ? (
                // カスタムレンダラーがある場合はそれを使用
                breadcrumb.render()
              ) : breadcrumb.href ? (
                <BreadcrumbLink asChild>
                  <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export const useBreadcrumbs = () => {
  return use(BreadcrumbContext);
};
