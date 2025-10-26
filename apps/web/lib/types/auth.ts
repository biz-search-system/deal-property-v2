import { z } from "zod";
import { loginSchema, signupSchema } from "@/lib/zod/schemas/auth";

export type Signup = z.infer<typeof signupSchema>;
export type Login = z.infer<typeof loginSchema>;
