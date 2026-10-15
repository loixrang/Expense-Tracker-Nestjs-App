import {BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import z from "zod"

@Injectable()
export class ZodValidationPipes implements PipeTransform{
  constructor (private readonly schema: z.ZodType) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value)

    if (!result.success) {
      throw new BadRequestException(result.error.issues)
    }

    return result.data
  }
}