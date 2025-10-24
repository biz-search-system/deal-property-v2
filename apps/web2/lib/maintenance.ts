import { NextRequest, NextResponse } from "next/server";
import type { MaintenanceConfig } from "@/lib/types/maintenance";

const maintenanceAllowedRoutes = ["/maintenance", "/not-found", "/"];

export async function handleMaintenanceMode(
  request: NextRequest,
  maintenance: MaintenanceConfig | null
): Promise<NextResponse | null> {
  // console.log("maintenance", maintenance);
  if (!maintenance?.enabled) {
    return null;
  }

  const now = new Date();

  if (maintenance.startTime) {
    const startTime = new Date(maintenance.startTime + ":00+09:00");
    if (now < startTime) {
      return null;
    }
  }

  if (maintenance.endTime) {
    const endTime = new Date(maintenance.endTime + ":00+09:00");
    if (now >= endTime) {
      return null;
    }
  }

  const path = request.nextUrl.pathname;
  const isMaintenanceAllowedRoute = maintenanceAllowedRoutes.includes(path);

  if (!isMaintenanceAllowedRoute) {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  return null;
}

export { maintenanceAllowedRoutes };
