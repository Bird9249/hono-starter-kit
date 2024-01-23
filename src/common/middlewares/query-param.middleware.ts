import { Context, Env, Next } from "hono";
import { object, z } from "zod";
import { ValidationFailed } from "../exception/http";
import PaginateSchema from "../zod-schema/paginate.schema";

export default async function (
  { req }: Context<Env, string, {}>,
  next: Next,
  properties: string[]
) {
  const query = req.query();


  const result = PaginateSchema.merge(
    object({
      column: z.enum(["id", ...properties]).nullish(),
    })
  ).safeParse(query);

  if (!result.success) throw new ValidationFailed(result);

  await next();
}
