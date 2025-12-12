import { getAllUnconfirmedPropertiesBySettlementDate } from "@/lib/data/property";
import { UnconfirmedProperties } from "@/components/property/unconfirmed/unconfirmed-properties";
import { BreadcrumbConfig } from "@/components/breadcrumb-provider";

export default async function UnconfirmedPropertiesPage() {
  // ユーザーの所属組織のBC確定前案件を組織順・決済日順で取得
  const unconfirmedProperties = await getAllUnconfirmedPropertiesBySettlementDate();

  // 集計計算（利益はprofitフィールドから直接取得）
  const totals = {
    profitEstimate: unconfirmedProperties.reduce((sum, p) => {
      return sum + (p.profit || 0);
    }, 0),
    count: unconfirmedProperties.length,
  };

  return (
    <>
      <BreadcrumbConfig items={[{ label: "業者確定前" }]} />
      <UnconfirmedProperties
        properties={unconfirmedProperties}
        totals={totals}
      />
    </>
  );
}
