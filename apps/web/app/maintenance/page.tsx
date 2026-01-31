import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";
import { Home } from "lucide-react";
import { get } from "@vercel/edge-config";
import type { Maintenance } from "@/lib/types/maintenance";
import { MaintenanceTimer } from "./maintenance-timer";
import { Metadata } from "next";
import { AppConfig } from "@/app.config";

export const metadata: Metadata = {
  title: "メンテナンス",
  description: `${AppConfig.title}のメンテナンス中です。`,
};

export default async function MaintenancePage() {
  const maintenance = await get<Maintenance>("maintenance");

  return (
    <div className="h-dvh flex items-center justify-center bg-background">
      <div className="max-w-md w-full px-6 py-8">
        <div className="text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center">
            <Image
              src="/logo.png"
              alt={AppConfig.title}
              width={64}
              height={64}
              className="drop-shadow-md"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              メンテナンス中
            </h1>
            <p className="text-sm text-muted-foreground">
              {maintenance?.message ||
                "現在、システムのメンテナンスを実施しております。"}
              <br />
              ご不便をおかけして申し訳ございません。
            </p>
          </div>

          <MaintenanceTimer maintenance={maintenance} />

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default" className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                ホームに戻る
              </Link>
            </Button>
          </div>

          <div className="pt-6 border-t">
            <p className="text-xs text-muted-foreground">
              メンテナンス終了後、自動的にサービスが再開されます。
              <br />
              お急ぎの場合は、管理者にお問い合わせください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
