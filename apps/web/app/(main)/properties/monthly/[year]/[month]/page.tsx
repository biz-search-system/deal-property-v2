import { MonthlyPropertiesClient } from "./monthly-properties-client";
import {
  BUSINESS_STATUS,
  properties,
} from "../../../data/property";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export default async function MonthlyPropertiesPage({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;

  // 選択月の日付
  const selectedDate = new Date(Number(year), Number(month) - 1);
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);

  // 月別フィルタリング
  const filteredProperties = properties.filter((property) => {
    // BC確定前は除外
    if (property.businessStatus === BUSINESS_STATUS.BC_UNCONFIRMED)
      return false;

    // 決済日でフィルタリング
    if (!property.settlementDate) return false;
    const settlementDate = new Date(property.settlementDate);
    return isWithinInterval(settlementDate, {
      start: monthStart,
      end: monthEnd,
    });
  });

  return (
    <MonthlyPropertiesClient
      year={year}
      month={month}
      properties={filteredProperties}
    />
  );
}
