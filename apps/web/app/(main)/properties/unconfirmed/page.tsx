import { getProperties } from "@/lib/data/property";
import { UnconfirmedProperties } from "@/components/property/unconfirmed/unconfirmed-properties";
import { BreadcrumbConfig } from "@/components/breadcrumb-provider";

export default async function UnconfirmedPropertiesPage() {
  // BC確定前の案件のみフィルター
  const allProperties = await getProperties();
  const unconfirmedProperties = allProperties.filter(
    (p) => p.progressStatus === "bc_before_confirmed"
  );

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
