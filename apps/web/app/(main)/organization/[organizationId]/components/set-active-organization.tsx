"use client";

import { setActiveOrganizationAction } from "@/lib/actions/organization";
import { useEffect } from "react";
import { mutate } from "swr";

export function SetActiveOrganization({
  organizationId,
}: {
  organizationId: string;
}) {
  useEffect(() => {
    setActiveOrganizationAction(organizationId).then(() => {
      mutate("/api/organization");
    });
  }, [organizationId]);

  return null;
}
