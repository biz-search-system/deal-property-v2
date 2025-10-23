import { z } from "zod";
import { signupSchema } from "@/lib/zod/schemas/auth";
// import { verifySession } from "@/lib/data/sesstion";

export type Signup = z.infer<typeof signupSchema>;
