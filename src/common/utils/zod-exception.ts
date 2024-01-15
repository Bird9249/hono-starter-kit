import { ZodObject } from "zod";
import { ValidationFailed } from "../exception/http";

export default function (schema: ZodObject<any>, value: any) {
  const result = schema.safeParse(value);

  if (!result.success) {
    throw new ValidationFailed(result);
  }

  return result.data;
}
