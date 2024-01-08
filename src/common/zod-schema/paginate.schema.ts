import { object, string } from "zod";
import OrderBySchema from "./order-by.schema";

const PaginateSchema = object({
  offset: string()
    .nullish()
    .transform((value) => (value ? Number(value) : value)),
  limit: string()
    .nullish()
    .transform((value) => (value ? Number(value) : value)),
}).merge(OrderBySchema);

export default PaginateSchema;
