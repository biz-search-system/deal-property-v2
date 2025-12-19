import { z } from "zod";
import {
  forgotPasswordSchema,
  loginSchema,
  organizationCreateSchema,
  passwordChangeSchema,
  resetPasswordSchema,
  signupSchema,
} from "@/lib/zod/schemas/auth";
import { authClient } from "@workspace/auth/client";

export type Signup = z.infer<typeof signupSchema>;
export type Login = z.infer<typeof loginSchema>;
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
export type PasswordChange = z.infer<typeof passwordChangeSchema>;

export type User = (typeof authClient.$Infer.Session)["user"];

export type OrganizationCreate = z.infer<typeof organizationCreateSchema>;
