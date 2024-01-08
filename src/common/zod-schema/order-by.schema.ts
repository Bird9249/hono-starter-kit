import { object, z } from "zod";
import User from "../../modules/users/domain/entities/user.entity";

const userProps: string[] = Object.keys(new User()).slice(1);

const OrderBySchema = object({
  column: z.enum(["id", ...userProps]).nullish(),
  sort_order: z.enum(["ASC", "DESC"]).nullish(),
});

export default OrderBySchema;
