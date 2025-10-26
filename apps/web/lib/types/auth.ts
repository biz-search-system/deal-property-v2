import { z } from "zod";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "@/lib/zod/schemas/auth";

export type Signup = z.infer<typeof signupSchema>;
export type Login = z.infer<typeof loginSchema>;
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
