import "server-only";

import { db } from "@workspace/drizzle/db";
import { properties } from "@workspace/drizzle/schemas/property";
import { eq } from "drizzle-orm";

/**
 * 全案件を取得
 */
export async function getProperties() {
  return db.query.properties.findMany({
    with: {
      organization: true,
      staff: {
        with: {
          user: true,
        },
      },
      contractProgress: true,
      documentProgress: true,
      settlementProgress: true,
    },
    orderBy: (props, { desc }) => [desc(props.createdAt)],
  });
}

/**
 * IDで案件を取得
 */
export async function getPropertyById(id: string) {
  return db.query.properties.findFirst({
    where: eq(properties.id, id),
    with: {
      organization: true,
      staff: {
        with: {
          user: true,
        },
      },
      contractProgress: true,
      documentProgress: true,
      settlementProgress: true,
    },
  });
}

