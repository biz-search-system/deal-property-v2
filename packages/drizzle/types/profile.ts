import { profileUpdateSchema } from "../zod-schemas/profile";
import z from "zod";

export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
