import { registerUserSchema } from "../../auth/dto/register.dto.js";
import z from "zod";

export const updateUserSchema = registerUserSchema.partial()

export type UpdateUserDto = z.infer<typeof updateUserSchema>
