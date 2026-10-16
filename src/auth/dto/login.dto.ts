import { registerUserSchema } from "./register.dto.js";
import z from "zod";

export const loginSchema = registerUserSchema.pick({
  email: true,
  password: true,
})

export type LoginSchemaDto = z.infer<typeof loginSchema>