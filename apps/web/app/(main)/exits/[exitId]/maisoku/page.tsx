import { BreadcrumbConfig } from "@/components/breadcrumb-provider";
import { MaisokuEditor } from "@/components/exit/maisoku/maisoku-editor";
import type { CompanyInfo } from "@/components/exit/maisoku/maisoku-editor";
import { getExitById } from "@/lib/mocks/exits";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "マイソク作成",
};

/** MVP用ハードコード会社情報（将来的にorganizations.metadataから取得） */
const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: "株式会社レイジット",
  logoUrl: null,
  postalCode: "530-0044",
  address: "大阪府大阪市北区東天満2丁目10-17 マツイビル4F",
  tel: "06-6379-5778",
  fax: "06-6379-5779",
  licenseNumber: "大阪府知事(1)第64796号",
  staffName: null,
  transactionType: "売主",
};

export default async function MaisokuPage({
  params,
}: PageProps<"/exits/[exitId]/maisoku">) {
  const { exitId } = await params;

  const exit = getExitById(exitId);

  if (!exit) {
    notFound();
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <BreadcrumbConfig
        items={[
          { label: "出口管理", href: "/exits" },
          {
            label: `${exit.propertyName}${exit.roomNumber ? ` ${exit.roomNumber}` : ""}`,
            href: `/exits/${exitId}`,
          },
          { label: "マイソク作成" },
        ]}
      />
      <MaisokuEditor exit={exit} companyInfo={DEFAULT_COMPANY_INFO} />
    </div>
  );
}
