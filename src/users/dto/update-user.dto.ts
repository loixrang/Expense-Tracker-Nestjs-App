import { registerSchema } from "../../auth/dto/register.dto.js";
import z from "zod";

export const updateUserSchema = registerSchema.partial()

export type UpdateUserDto = z.infer<typeof updateUserSchema>
