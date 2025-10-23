import { z } from "zod/v4";
import { signupSchema } from "../zod/auth";

export type Signup = z.infer<typeof signupSchema>;
