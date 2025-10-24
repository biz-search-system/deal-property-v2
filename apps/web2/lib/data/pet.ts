import "server-only";

import { db } from "@/db";
import { pets } from "@/db/schemas/pet";

export async function getPets() {
  return db.query.pets.findMany();
}
