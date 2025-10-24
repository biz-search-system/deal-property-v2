import { z } from "zod";
import { signupSchema } from "@/lib/zod/schemas/auth";
import { verifySession } from "@/lib/sesstion";

export type SignupFormData = z.infer<typeof signupSchema>;
