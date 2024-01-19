import { object, z } from "zod";

const OrderBySchema = object({
  sort_order: z.enum(["ASC", "DESC"]).nullish(),
});

export default OrderBySchema;
