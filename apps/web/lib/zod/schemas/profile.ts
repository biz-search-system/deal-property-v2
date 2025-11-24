import z from "zod";
import { nameSchema, usernameSchema } from "./auth";

export const profileSchema = z.object({
  name: nameSchema,
  username: usernameSchema,
});
