import { Context } from "hono";
import { ZodError } from "zod";

type ResultType =
  | {
      success: true;
      data: any;
    }
  | {
      success: false;
      error: ZodError<any>;
      data: any;
    };

export default function (result: ResultType, { json }: Context) {
  if (!result.success) {
    return json(result.error.formErrors, 400);
  }
}
